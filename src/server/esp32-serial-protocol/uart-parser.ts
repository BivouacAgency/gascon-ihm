import { EventEmitter } from "events";
import { cobsDecode } from "./cobs.js";
import { validateCrc16 } from "./crc16.js";
import {
  OperatingMode,
  PROTOCOL_CONSTANTS,
  CMD_IDS,
  type ESP32Message,
  type RawFrame,
  ESP32Command,
} from "./types.js";
import { env } from "../../env.js";
import { getCmdFromId } from "./utils/getCmdFromId.js";

// This file contains the UART parser for the ESP32 serial protocol

// Parser state
enum ParserState {
  WAIT_SOF,
  IN_FRAME,
}

// UART parser class
export class UARTParser extends EventEmitter {
  private state: ParserState = ParserState.WAIT_SOF;
  private frameBuffer: Buffer = Buffer.alloc(0);
  private readonly maxFrameSize = 256;

  /**
   * Log debug information only if UART_VERBOSE is enabled
   */
  private verboseLog(...args: unknown[]): void {
    if (env.UART_VERBOSE) {
      console.log(...args);
    }
  }

  /**
   * Format hex data with spaces between bytes for better readability
   */
  private formatHex(buffer: Buffer): string {
    return Array.from(buffer)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join(' ');
  }

  /**
   * Process incoming UART data
   * @param data - Raw UART data
   */
  public processData(data: Buffer): void {
    this.verboseLog("🔍 [Parser] Raw UART data received:", this.formatHex(data));
    
    // For each byte in the data
    for (const byte of data) {
      if (byte === undefined) continue;
      
      // Process the byte
      this.processByte(byte);
    }
  }

  // Process a single byte
  private processByte(byte: number): void {
    switch (this.state) {
      case ParserState.WAIT_SOF:
        // If the byte is the start of frame (SOF)
        if (byte === PROTOCOL_CONSTANTS.SOF) {
          this.state = ParserState.IN_FRAME;
          this.frameBuffer = Buffer.alloc(0);
        }
        break;

      case ParserState.IN_FRAME:
        // If the byte is the end of frame (EOF)
        if (byte === PROTOCOL_CONSTANTS.EOF) {
          // Check for the separator byte (0x00) that should follow EOF
          this.state = ParserState.WAIT_SOF;
          this.processCompleteFrame();
        } else {
          // If the frame buffer is not too large, add the byte to the frame buffer
          if (this.frameBuffer.length < this.maxFrameSize) {
            this.frameBuffer = Buffer.concat([this.frameBuffer, Buffer.from([byte])]);
          } else {
            // If the frame buffer is too large, reset the parser
            console.warn("⚠️ [UART Parser] Frame too large, resetting");
            this.state = ParserState.WAIT_SOF;
            this.frameBuffer = Buffer.alloc(0);
          }
        }
        break;
    }
  }

  // Process a complete frame
  private processCompleteFrame(): void {
    try {
      this.verboseLog("🔍 [Parser] Raw COBS frame:", this.formatHex(this.frameBuffer));
      
      // COBS decode the frame (remove the 0x00 bytes)
      const decodedFrame = cobsDecode(this.frameBuffer);
      this.verboseLog("🔍 [Parser] COBS decoded frame:", this.formatHex(decodedFrame));
      
      if (decodedFrame.length < 3) {
        this.emit("error", new Error("Frame too short after COBS decoding"));
        return;
      }

      // Validate CRC (check if the CRC is valid)
      if (!validateCrc16(decodedFrame)) {
        this.emit("error", new Error("CRC validation failed"));
        return;
      }

      // Parse the frame structure: [LEN][CMD_ID][Payload...][CRC-16 LO][CRC-16 HI]
      // Get the length of the frame
      const length = decodedFrame[0];
      // Get the command ID
      const commandId = decodedFrame[1];
      
      if (length === undefined || commandId === undefined) {
        this.emit("error", new Error("Invalid frame structure"));
        return;
      }

      // The LEN field represents the size of the CMD|Payload|CRC block (excluding LEN byte)
      // So the decoded frame should be LEN + 1 bytes long (including LEN byte)
      if (decodedFrame.length !== length + 1) {
        this.emit("error", new Error(`Frame length mismatch: expected ${length + 1}, got ${decodedFrame.length}`));
        return;
      }

      // Get the payload
      const payload = decodedFrame.subarray(2, length - 1);
      // Get the CRC low byte
      const crcLo = decodedFrame[length - 1];
      // Get the CRC high byte
      const crcHi = decodedFrame[length];
      
      this.verboseLog("🔍 [Parser] Frame breakdown:");
      this.verboseLog(`  - Length: ${length}`);
      this.verboseLog(`  - Command ID: 0x${commandId.toString(16).padStart(2, '0')}`);
      this.verboseLog(`  - Payload (${payload.length} bytes):`, this.formatHex(payload));
      this.verboseLog(`  - CRC: 0x${crcLo?.toString(16).padStart(2, '0')}${crcHi?.toString(16).padStart(2, '0')}`);
      
      if (crcLo === undefined || crcHi === undefined) {
        this.emit("error", new Error("Missing CRC bytes"));
        return;
      }

      // Calculate the CRC
      const crc = (crcHi << 8) | crcLo;

      // Create a new raw frame
      const rawFrame: RawFrame = {
        length,
        commandId,
        payload,
        crc,
      };

      this.emit("frame", rawFrame);

      // Parse the message based on command ID
      const message = this.parseMessage(commandId, payload);
      if (message) {
        this.emit("message", message);
      }

    } catch (error) {
      this.emit("error", error as Error);
    }
  }

  private parseMessage(commandId: number, payload: Buffer): ESP32Message | null {
    const timestamp = Date.now();

    // Parse the message based on command ID
    switch (commandId) {
      case CMD_IDS.PONG:
        return {
          type: ESP32Command.PONG,
          timestamp,
        };

      case CMD_IDS.STATUS_UPDATE:
        return this.parseStatusUpdate(payload, timestamp);

      case CMD_IDS.ACK:
        this.verboseLog(`🔍 ACK payload ${payload.length} bytes: ${this.formatHex(payload)}`);
        
        if (payload.length !== 1) {
          this.emit("error", new Error(`Expected 1 byte, got ${payload.length}`));
          return null;
        }

        const acknowledgedCommandId = payload[0]!;
        const acknowledgedCommand = getCmdFromId(acknowledgedCommandId);
        
        if (!acknowledgedCommand) {
          this.emit("error", new Error(`Unknown acknowledged command ID: 0x${acknowledgedCommandId.toString(16)}`));
          return null;
        }
        
        this.verboseLog(`Acknowledged command: ${acknowledgedCommand} (0x${acknowledgedCommandId.toString(16)})`);

        return {
          type: ESP32Command.ACK,
          acknowledgedCommand,
          timestamp,
        };

      case CMD_IDS.MAN_HEAT_STATUS:
        return this.parseManualHeatStatus(payload, timestamp);

      case CMD_IDS.SENSOR_DATA:
        return this.parseSensorData(payload, timestamp);

      default:
        this.emit("error", new Error(`Unknown command ID: 0x${commandId.toString(16)}`));
        return null;
    }
  }

  private parseStatusUpdate(payload: Buffer, timestamp: number): ESP32Message | null {
    this.verboseLog("🔍 [Parser] STATUS_UPDATE payload analysis:");
    this.verboseLog(`  - Payload length: ${payload.length} bytes`);
    this.verboseLog(`  - Raw payload: ${this.formatHex(payload)}`);
    this.verboseLog(`  - Individual bytes: [${Array.from(payload).map(b => `0x${b.toString(16).padStart(2, '0')}`).join(', ')}]`);
    
    if (payload.length !== 5) {
      this.emit("error", new Error(`Expected 5 bytes, got ${payload.length}`));
      return null;
    }

    // Structure: [relays_bitmap:uint16][inputs_bitmap:uint16][mode:uint8]
    const relaysBitmap = payload.readUInt16LE(0);
    const inputsBitmap = payload.readUInt16LE(2);
    const modeValue = payload[4]!;
    
    this.verboseLog(`  - Parsed relays: 0x${relaysBitmap.toString(16).padStart(4, '0')} (from bytes 0x${payload[0]?.toString(16)}, 0x${payload[1]?.toString(16)})`);
    this.verboseLog(`  - Parsed inputs: 0x${inputsBitmap.toString(16).padStart(4, '0')} (from bytes 0x${payload[2]?.toString(16)}, 0x${payload[3]?.toString(16)})`);
    this.verboseLog(`  - Parsed mode: ${modeValue} (from byte 0x${payload[4]?.toString(16)})`);

    let mode: OperatingMode;
    switch (modeValue) {
      case 0:
        mode = OperatingMode.MANUAL;
        break;
      case 1:
        mode = OperatingMode.AUTO;
        break;
      case 2:
        mode = OperatingMode.PAUSE;
        break;
      default:
        mode = OperatingMode.MANUAL;
        break;
    }

    return {
      type: ESP32Command.STATUS_UPDATE,
      relaysBitmap,
      inputsBitmap,
      mode,
      timestamp,
    };
  }

  private parseManualHeatStatus(payload: Buffer, timestamp: number): ESP32Message | null {
    this.verboseLog(`🔍 MAN_HEAT_STATUS payload ${payload.length} bytes: ${this.formatHex(payload)}`);
    
    // Check if the payload length is correct
    const EXPECTED_LENGTH = 15;
    if (payload.length !== EXPECTED_LENGTH) {
      this.emit("error", new Error(`MAN_HEAT_STATUS: Expected ${EXPECTED_LENGTH} bytes, got ${payload.length}`));
      return null;
    }

    // Structure: [active:uint8][sensor_id:uint8][target:uint16][current:uint16][remain_ms:uint32][heater_mask:uint8][elapsed_time:uint32]
    const active = payload.readUInt8(0);
    const sensorId = payload.readUInt8(1);
    const target = payload.readUInt16LE(2);
    const current = payload.readUInt16LE(4);
    const remainMs = payload.readUInt32LE(6);
    const heaterMask = payload.readUInt8(10);
    const elapsedTime = payload.readUInt32LE(11);

    this.verboseLog(`Active: ${active}, Sensor ID: ${sensorId}, Target: ${target}, Current: ${current}, Remain Ms: ${remainMs}, Heater Mask: ${heaterMask}`);

    return {
      type: ESP32Command.MAN_HEAT_STATUS,
      active,
      sensorId,
      target,
      current,
      remainMs,
      heaterMask,
      elapsedTime,
      timestamp,
    };
  }

  private parseSensorData(payload: Buffer, timestamp: number): ESP32Message | null {

    this.verboseLog(`🔍 SENSOR payload ${payload.length} bytes: ${this.formatHex(payload)}`);
    if (payload.length !== 8) {
      this.emit("error", new Error(`Expected 8 bytes, got ${payload.length}`));
      return null;
    }
  
    // Get the temperature of the R1 sensor
    const t_R1 = payload.readInt16LE(0);
    const t_R2 = payload.readInt16LE(2);
    const t_TT1 = payload.readInt16LE(4);
    const p_PT1 = payload.readInt16LE(6);
  
    const tempR1 = t_R1 / 10;
    const tempR2 = t_R2 / 10;
    const tempTT1 = t_TT1 / 10;
    const pressPT1 = p_PT1 / 10;
  
    this.verboseLog(`Raw: ${t_R1},${t_R2},${t_TT1},${p_PT1}; Scaled: ${tempR1}°C, ${tempR2}°C, ${tempTT1}°C, ${pressPT1}bar`);
  
    // If the sensor value is 0x7FFF, it means there is an error
    const SENSOR_ERROR = 0x7FFF;
    // Check if there is an error in any of the sensors
    const hasError = [t_R1, t_R2, t_TT1, p_PT1].includes(SENSOR_ERROR);
    if (hasError) this.verboseLog("⚠️ Sensor error (0x7FFF)");
  
    // Return the sensor data message
    return {
      type: ESP32Command.SENSOR_DATA,
      timestamp,
      sensors: [
        { sensorName: "TT-R1", readingValue: tempR1, unit: "°C", error: t_R1 === SENSOR_ERROR },
        { sensorName: "TT-R2", readingValue: tempR2, unit: "°C", error: t_R2 === SENSOR_ERROR },
        { sensorName: "TT1", readingValue: tempTT1, unit: "°C", error: t_TT1 === SENSOR_ERROR },
        { sensorName: "PT1", readingValue: pressPT1, unit: "bar", error: p_PT1 === SENSOR_ERROR }
      ],
      error: hasError
    };
  }
  

  /**
   * Reset the parser state
   */
  public reset(): void {
    this.state = ParserState.WAIT_SOF;
    this.frameBuffer = Buffer.alloc(0);
  }
} 