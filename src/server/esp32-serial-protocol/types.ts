// Protocol constants
export const PROTOCOL_CONSTANTS = {
  SOF: 0x7E,
  EOF: 0x7F,
  SEP: 0x00,
  BAUD_RATE: 115200,
} as const;

// Command IDs
export const CMD_IDS = {
  PING: 0x01,
  PONG: 0x81,
  STATUS_UPDATE: 0x82,
  SENSOR_DATA: 0x83,
  MAN_HEAT_START: 0x11,
  ACK: 0x8A,
  MAN_HEAT_STATUS: 0x89,
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
  isActive: boolean;
  command: number;
  param1: number;
  param2: number;
  temperature: number;
  status: number;
  data1: number;
  data2: number;
  data3: number;
  data4: number;
  originalCommand: number;
  timestamp: number;
}

export interface AckMessage {
  type: "ACK";
  acknowledgedCommand: number;
  timestamp: number;
}

export interface SensorDataMessage {
  type: "SENSOR_DATA";
  t_R1: number;  // Temperature R1 (°C × 10)
  t_R2: number;  // Temperature R2 (°C × 10)
  t_TT1: number; // Temperature TT1 (°C × 10)
  p_PT1: number; // Pressure PT1 (bar × 10)
  timestamp: number;
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