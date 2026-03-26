// Protocol constants
export const PROTOCOL_CONSTANTS = {
  SOF: 0x7E,
  EOF: 0x7F,
  SEP: 0x00,
  BAUD_RATE: 115200,
} as const;

export enum ESP32Command {
  PING = "PING",
  MAN_HEAT_START = "MAN_HEAT_START",
  MAN_HEAT_STOP = "MAN_HEAT_STOP",
  MAN_HEAT_STATUS = "MAN_HEAT_STATUS",
  STATUS_UPDATE = "STATUS_UPDATE",
  SENSOR_DATA = "SENSOR_DATA",
  ACK = "ACK",
  PONG = "PONG",
  MAN_ACT= "MAN_ACTUATOR"
}

// Operating modes
export enum OperatingMode {
  MANUAL = "MANUAL",
  AUTO = "AUTO",
  PAUSE = "PAUSE",
}

export const CMD_IDS: Record<ESP32Command, number> = {
  // Outgoing commands
  [ESP32Command.PING]: 0x01,
  [ESP32Command.MAN_HEAT_START]: 0x11,
  [ESP32Command.MAN_HEAT_STOP]: 0x12,
  [ESP32Command.MAN_ACT]: 0x04,
  // Incoming commands
  [ESP32Command.PONG]: 0x81,
  [ESP32Command.STATUS_UPDATE]: 0x82,
  [ESP32Command.SENSOR_DATA]: 0x83,
  [ESP32Command.MAN_HEAT_STATUS]: 0x88,
  [ESP32Command.ACK]: 0x8A,
};

// Parsed message types
export interface PongMessage {
  type: ESP32Command.PONG;
  timestamp: number;
}

export interface StatusUpdateMessage {
  type: ESP32Command.STATUS_UPDATE;
  relaysBitmap: number;
  inputsBitmap: number;
  mode: OperatingMode;
  timestamp: number;
}

export interface ManualHeatStatusMessage {
  type: ESP32Command.MAN_HEAT_STATUS;
  active: number;      // uint8
  sensorId: number;    // uint8
  target: number;      // uint16
  current: number;     // uint16
  remainMs: number;    // uint32
  heaterMask: number;  // uint8
  elapsedTime: number; // uint32
  timestamp: number;
}

export interface AckMessage {
  type: ESP32Command.ACK;
  acknowledgedCommand: ESP32Command;
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
  type: ESP32Command.SENSOR_DATA;
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