import { EventEmitter } from "events";
import { cobsDecode } from "./cobs.js";
import { validateCrc16 } from "./crc16.js";
import {
  PROTOCOL_CONSTANTS,
  CMD_IDS,
  type ESP32Message,
  type RawFrame,
  type OperatingMode,
} from "./types.js";
import { env } from "../../env.js";

enum ParserState {
  WAIT_SOF,
  IN_FRAME,
}

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
    
    for (let i = 0; i < data.length; i++) {
      const byte = data[i];
      if (byte === undefined) continue;
      
      this.processByte(byte);
    }
  }

  private processByte(byte: number): void {
    switch (this.state) {
      case ParserState.WAIT_SOF:
        if (byte === PROTOCOL_CONSTANTS.SOF) {
          this.state = ParserState.IN_FRAME;
          this.frameBuffer = Buffer.alloc(0);
        }
        break;

      case ParserState.IN_FRAME:
        if (byte === PROTOCOL_CONSTANTS.EOF) {
          // Check for the separator byte (0x00) that should follow EOF
          this.state = ParserState.WAIT_SOF;
          this.processCompleteFrame();
        } else {
          // Accumulate frame data
          if (this.frameBuffer.length < this.maxFrameSize) {
            this.frameBuffer = Buffer.concat([this.frameBuffer, Buffer.from([byte])]);
          } else {
            // Frame too large, reset
            console.warn("⚠️ [UART Parser] Frame too large, resetting");
            this.state = ParserState.WAIT_SOF;
            this.frameBuffer = Buffer.alloc(0);
          }
        }
        break;
    }
  }

  private processCompleteFrame(): void {
    try {
      this.verboseLog("🔍 [Parser] Raw COBS frame:", this.formatHex(this.frameBuffer));
      
      // COBS decode the frame
      const decodedFrame = cobsDecode(this.frameBuffer);
      this.verboseLog("🔍 [Parser] COBS decoded frame:", this.formatHex(decodedFrame));
      
      if (decodedFrame.length < 3) {
        this.emit("error", new Error("Frame too short after COBS decoding"));
        return;
      }

      // Validate CRC
      if (!validateCrc16(decodedFrame)) {
        this.emit("error", new Error("CRC validation failed"));
        return;
      }

      // Parse the frame structure: [LEN][CMD_ID][Payload...][CRC-16 LO][CRC-16 HI]
      const length = decodedFrame[0];
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

      const payload = decodedFrame.subarray(2, length - 1);
      const crcLo = decodedFrame[length - 1];
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

      const crc = (crcHi << 8) | crcLo;

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

    switch (commandId) {
      case CMD_IDS.PONG:
        return {
          type: "PONG",
          timestamp,
        };

      case CMD_IDS.STATUS_UPDATE:
        return this.parseStatusUpdate(payload, timestamp);

      case CMD_IDS.ACK:
        if (payload.length >= 1) {
          const acknowledgedCommand = payload[0];
          if (acknowledgedCommand !== undefined) {
            return {
              type: "ACK",
              acknowledgedCommand,
              timestamp,
            };
          }
        }
        this.emit("error", new Error("Invalid ACK payload"));
        return null;

      case CMD_IDS.MAN_HEAT_STATUS:
        return this.parseManualHeatStatus(payload, timestamp);

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
      this.emit("error", new Error(`STATUS_UPDATE payload incorrect length: expected 5 bytes, got ${payload.length} bytes`));
      return null;
    }

    // Structure: [relays_bitmap:uint16][inputs_bitmap:uint16][mode:uint8]
    const relaysBitmap = (payload[1]! << 8) | payload[0]!;  // Little endian
    const inputsBitmap = (payload[3]! << 8) | payload[2]!;  // Little endian
    const modeValue = payload[4]!;
    
    this.verboseLog(`  - Parsed relays: 0x${relaysBitmap.toString(16).padStart(4, '0')} (from bytes 0x${payload[0]?.toString(16)}, 0x${payload[1]?.toString(16)})`);
    this.verboseLog(`  - Parsed inputs: 0x${inputsBitmap.toString(16).padStart(4, '0')} (from bytes 0x${payload[2]?.toString(16)}, 0x${payload[3]?.toString(16)})`);
    this.verboseLog(`  - Parsed mode: ${modeValue} (from byte 0x${payload[4]?.toString(16)})`);

    let mode: OperatingMode;
    switch (modeValue) {
      case 0:
        mode = "MANUAL";
        break;
      case 1:
        mode = "AUTO";
        break;
      case 2:
        mode = "PAUSE";
        break;
      default:
        mode = "MANUAL";
        break;
    }

    return {
      type: "STATUS_UPDATE",
      relaysBitmap,
      inputsBitmap,
      mode,
      timestamp,
    };
  }

  private parseManualHeatStatus(payload: Buffer, timestamp: number): ESP32Message | null {
    if (payload.length < 11) {
      this.emit("error", new Error("MANUAL_HEAT_STATUS payload too short"));
      return null;
    }

    // Structure based on ESP32 code: [is_active, command, param1, param2, temperature, status, data1, data2, data3, data4, original_command]
    return {
      type: "MANUAL_HEAT_STATUS",
      isActive: payload[0] !== 0,
      command: payload[1]!,
      param1: payload[2]!,
      param2: payload[3]!,
      temperature: payload[4]!,
      status: payload[5]!,
      data1: payload[6]!,
      data2: payload[7]!,
      data3: payload[8]!,
      data4: payload[9]!,
      originalCommand: payload[10]!,
      timestamp,
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