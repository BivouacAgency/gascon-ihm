// Protocol constants
export const PROTOCOL_CONSTANTS = {
  SOF: 0x7E,
  EOF: 0x7F,
  SEP: 0x00,
  BAUD_RATE: 115200,
} as const;

// Outgoing command IDs (commands we send to ESP32) - starting with "1"
export const OUTGOING_CMD_IDS = {
  PING: 0x01,
  MAN_HEAT_START: 0x11,
  MAN_HEAT_STOP: 0x14,
} as const;

// Incoming command IDs (commands we receive from ESP32) - starting with "8"
export const INCOMING_CMD_IDS = {
  PONG: 0x81,
  STATUS_UPDATE: 0x82,
  SENSOR_DATA: 0x83,
  MAN_HEAT_STATUS: 0x88,
  ACK: 0x8A,
} as const;

export const CMD_IDS = {
  ...OUTGOING_CMD_IDS,
  ...INCOMING_CMD_IDS,
} as const;

// Operating modes
export type OperatingMode = "MANUAL" | "AUTO" | "PAUSE";

// Parsed message types
export interface PongMessage {
  type: "PONG";
  timestamp: number;
}

export interface StatusUpdateMessage {
  type: "STATUS_UPDATE";
  relaysBitmap: number;
  inputsBitmap: number;
  mode: OperatingMode;
  timestamp: number;
}

export interface ManualHeatStatusMessage {
  type: "MANUAL_HEAT_STATUS";
  active: number;      // uint8
  sensorId: number;    // uint8
  target: number;      // uint16
  current: number;     // uint16
  remainMs: number;    // uint32
  heaterMask: number;  // uint8
  timestamp: number;
}

export interface AckMessage {
  type: "ACK";
  acknowledgedCommand: number;
  timestamp: number;
}

// Data format for sensor reading
// ESP32 -> Frontend
export interface SensorReading {
  sensorName: string;
  readingValue: number;
  unit: string;
  error?: boolean;
}

// Data format for sensor readings message
// ESP32 -> Frontend
export interface SensorDataMessage {
  type: "SENSOR_DATA";
  timestamp: number;
  sensors: SensorReading[];
  error: boolean;
}

export type ESP32Message =
  | PongMessage
  | StatusUpdateMessage
  | ManualHeatStatusMessage
  | AckMessage
  | SensorDataMessage;

// Raw frame structure
export interface RawFrame {
  length: number;
  commandId: number;
  payload: Buffer;
  crc: number;
}

// Parser events
export interface ParserEvents {
  message: [message: ESP32Message];
  error: [error: Error];
  frame: [frame: RawFrame];
} 