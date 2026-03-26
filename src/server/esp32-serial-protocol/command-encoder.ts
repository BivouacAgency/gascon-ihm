import { cobsEncode } from "./cobs.ts";
import { appendCrc16 } from "./crc16.ts";
import { PROTOCOL_CONSTANTS, CMD_IDS, ESP32Command } from "./types.ts";

/**
 * Command encoder for sending commands to ESP32
 */
export class CommandEncoder {
  
  /**
   * Encodes a PING command
   */
  public static encodePing(): Buffer {
    return CommandEncoder.encodeCommand(CMD_IDS[ESP32Command.PING], Buffer.alloc(0));
  }

  /**
   * Encodes a manual heat start command
   * @param sensorId - Sensor ID (uint8)
   * @param target - Target temperature (uint16, scaled by 10)
   * @param holdMs - Hold time in milliseconds (uint32)
   * @param mask - Heater mask (uint8)
   */
  public static encodeManualHeatStart(sensorId: number, target: number, holdMs: number, mask: number): Buffer {
    const payload = Buffer.alloc(8);

    payload.writeUInt8(sensorId, 0);      // sensor_id: uint8
    payload.writeUInt16LE(target, 1);     // target: uint16 (little-endian)
    payload.writeUInt32LE(holdMs, 3);     // hold_ms: uint32 (little-endian)
    payload.writeUInt8(mask, 7);          // mask: uint8

    return CommandEncoder.encodeCommand(CMD_IDS.MAN_HEAT_START, payload);
  }


  /**
   * Encodes a manual actuator command
   */
  public static encodeManualActuator(actuator: number, command: number): Buffer {
    const payload = Buffer.alloc(2);

    payload.writeUInt8(actuator, 0);
    payload.writeUInt8(command, 0);


    return CommandEncoder.encodeCommand(CMD_IDS[ESP32Command.MAN_ACT], payload);
  }



  /**
   * Encodes a manual heat stop command
   */
  public static encodeManualHeatStop(): Buffer {
    return CommandEncoder.encodeCommand(CMD_IDS.MAN_HEAT_STOP, Buffer.alloc(0));
  }

  /**
   * Generic command encoder
   * @param commandId - Command ID
   * @param payload - Command payload
   */
  private static encodeCommand(commandId: number, payload: Buffer): Buffer {
    // Create frame structure: [LEN][CMD_ID][Payload...][CRC-16 LO][CRC-16 HI]
    const frameLength = 1 + 1 + payload.length + 2; // LEN + CMD_ID + payload + CRC
    const frame = Buffer.alloc(frameLength);
    
    let offset = 0;
    frame[offset++] = frameLength;     // LEN
    frame[offset++] = commandId;       // CMD_ID
    
    // Copy payload
    payload.copy(frame, offset);
    offset += payload.length;
    
    // Add CRC (will be calculated and appended by appendCrc16)
    const frameWithCrc = appendCrc16(frame.subarray(0, offset));
    
    // COBS encode the entire frame
    const encodedFrame = cobsEncode(frameWithCrc);
    
    // Create final packet: SOF + COBS-encoded data + EOF + SEP
    const packet = Buffer.alloc(1 + encodedFrame.length + 2);
    let packetOffset = 0;
    
    packet[packetOffset++] = PROTOCOL_CONSTANTS.SOF;
    encodedFrame.copy(packet, packetOffset);
    packetOffset += encodedFrame.length;
    packet[packetOffset++] = PROTOCOL_CONSTANTS.EOF;
    packet[packetOffset++] = PROTOCOL_CONSTANTS.SEP;
    
    return packet;
  }
} 