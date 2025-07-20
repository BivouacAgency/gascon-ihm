import { cobsEncode } from "../esp32-serial-protocol/cobs";
import { appendCrc16 } from "../esp32-serial-protocol/crc16";
import { CMD_IDS } from "../esp32-serial-protocol/types";

export interface MockConfig {
  /** Interval between STATUS_UPDATE messages in milliseconds */
  statusUpdateInterval: number;
  /** Initial delay before first message in milliseconds */
  initialDelay: number;
  /** Whether to generate random relay/input states */
  randomizeStates: boolean;
}

export class ESP32Mock {
  private config: MockConfig;
  private statusUpdateTimer?: NodeJS.Timeout;
  private messageCallback?: (data: Buffer) => void;

  constructor(config: Partial<MockConfig> = {}) {
    this.config = {
      statusUpdateInterval: 5000,
      initialDelay: 3000,
      randomizeStates: true,
      ...config,
    };
  }

  /**
   * Start sending mock ESP32 data
   * @param messageCallback - Callback to receive generated frame data
   */
  public start(messageCallback: (data: Buffer) => void): void {
    this.messageCallback = messageCallback;

    // Send initial STATUS_UPDATE after delay
    setTimeout(() => {
      this.sendStatusUpdate();
    }, this.config.initialDelay);

    // Set up periodic STATUS_UPDATE messages
    this.statusUpdateTimer = setInterval(() => {
      this.sendStatusUpdate();
    }, this.config.statusUpdateInterval);

    console.log(`🤖 [ESP32 Mock] Started - STATUS_UPDATE every ${this.config.statusUpdateInterval}ms`);
  }

  /**
   * Stop the mock data generation
   */
  public stop(): void {
    if (this.statusUpdateTimer) {
      clearInterval(this.statusUpdateTimer);
      this.statusUpdateTimer = undefined;
    }
    this.messageCallback = undefined;
    console.log("🤖 [ESP32 Mock] Stopped");
  }

  /**
   * Send a single STATUS_UPDATE frame
   */
  public sendStatusUpdate(): void {
    const relaysState = this.config.randomizeStates ? 
      Math.floor(Math.random() * 0xFFFF) : 0x0001;
    const inputsState = this.config.randomizeStates ? 
      Math.floor(Math.random() * 0xFFFF) : 0x0002;
    const mode = this.config.randomizeStates ? 
      Math.floor(Math.random() * 3) : 0; // 0=MANUAL, 1=AUTO, 2=PAUSE

    const frame = this.createStatusUpdateFrame(relaysState, inputsState, mode);
    
    if (this.messageCallback) {
      this.messageCallback(frame);
      console.log(`🔄 [ESP32 Mock] STATUS_UPDATE - relays:0x${relaysState.toString(16)}, inputs:0x${inputsState.toString(16)}, mode:${mode}`);
    }
  }

  /**
   * Send a PONG response frame
   */
  public sendPong(): void {
    const frame = this.createCommandFrame(CMD_IDS.PONG, Buffer.alloc(0));
    
    if (this.messageCallback) {
      this.messageCallback(frame);
      console.log("🏓 [ESP32 Mock] PONG");
    }
  }

  /**
   * Send an ACK response frame
   * @param acknowledgedCommand - The command being acknowledged
   */
  public sendAck(acknowledgedCommand: number): void {
    const payload = Buffer.from([acknowledgedCommand]);
    const frame = this.createCommandFrame(CMD_IDS.ACK, payload);
    
    if (this.messageCallback) {
      this.messageCallback(frame);
      console.log(`✅ [ESP32 Mock] ACK for command 0x${acknowledgedCommand.toString(16)}`);
    }
  }

  /**
   * Send a MANUAL_HEAT_STATUS frame
   */
  public sendManualHeatStatus(
    isActive: boolean = true,
    command: number = 0x11,
    param1: number = 0x22,
    param2: number = 0x33
  ): void {
    const payload = Buffer.from([
      isActive ? 1 : 0,  // is_active
      command,           // command
      param1,            // param1
      param2,            // param2
      32 + Math.floor(Math.random() * 20), // temperature (32-52)
      0x03,              // status
      0x88,              // data1
      0x13,              // data2
      0x00,              // data3
      0x00,              // data4
      command            // original_command
    ]);

    const frame = this.createCommandFrame(CMD_IDS.MAN_HEAT_STATUS, payload);
    
    if (this.messageCallback) {
      this.messageCallback(frame);
      console.log(`🔥 [ESP32 Mock] MANUAL_HEAT_STATUS - active:${isActive}, temp:${payload[4]}`);
    }
  }

  /**
   * Create a STATUS_UPDATE frame
   */
  private createStatusUpdateFrame(relaysState: number, inputsState: number, mode: number): Buffer {
    // Create payload: [relays_bitmap:uint16][inputs_bitmap:uint16][mode:uint8]
    const payload = Buffer.from([
      relaysState & 0xFF, (relaysState >> 8) & 0xFF,  // Little endian relays
      inputsState & 0xFF, (inputsState >> 8) & 0xFF,  // Little endian inputs
      mode
    ]);

    return this.createCommandFrame(CMD_IDS.STATUS_UPDATE, payload);
  }

  /**
   * Create a properly formatted command frame
   */
  private createCommandFrame(commandId: number, payload: Buffer): Buffer {
    // Create frame: [LEN][CMD_ID][Payload...][CRC-16 LO][CRC-16 HI]
    const frameLength = 1 + 1 + payload.length + 2; // LEN + CMD_ID + payload + CRC
    const frame = Buffer.alloc(frameLength);
    
    let offset = 0;
    frame[offset++] = frameLength;     // LEN
    frame[offset++] = commandId;       // CMD_ID
    
    // Copy payload
    payload.copy(frame, offset);
    offset += payload.length;
    
    // Add CRC
    const frameWithCrc = appendCrc16(frame.subarray(0, offset));
    
    // COBS encode
    const cobsEncoded = cobsEncode(frameWithCrc);
    
    // Create final packet: SOF + COBS-encoded data + EOF + SEP
    const packet = Buffer.alloc(1 + cobsEncoded.length + 2);
    let packetOffset = 0;
    
    packet[packetOffset++] = 0x7E;  // SOF
    cobsEncoded.copy(packet, packetOffset);
    packetOffset += cobsEncoded.length;
    packet[packetOffset++] = 0x7F;  // EOF
    packet[packetOffset++] = 0x00;  // SEP
    
    return packet;
  }
} 