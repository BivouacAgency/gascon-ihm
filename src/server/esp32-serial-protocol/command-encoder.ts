import { cobsEncode } from "./cobs.ts";
import { appendCrc16 } from "./crc16.ts";
import { PROTOCOL_CONSTANTS, CMD_IDS } from "./types.ts";

/**
 * Command encoder for sending commands to ESP32
 */
export class CommandEncoder {
  
  /**
   * Encodes a PING command
   */
  public static encodePing(): Buffer {
    return CommandEncoder.encodeCommand(CMD_IDS.PING, Buffer.alloc(0));
  }

  /**
   * Encodes a manual heat start command
   * @param param1 - First parameter
   * @param param2 - Second parameter
   * @param param3 - Third parameter
   */
  public static encodeManualHeatStart(param1: number, param2: number, param3: number): Buffer {
    const payload = Buffer.from([param1, param2, param3]);
    return CommandEncoder.encodeCommand(CMD_IDS.MAN_HEAT_START, payload);
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