import { ESP32Command } from "@/server/esp32-serial-protocol/types";

// This file contains the configuration for logging ESP32 messages

export const esp32MessagesLogFilter: Record<ESP32Command, boolean> = {
  [ESP32Command.MAN_HEAT_STATUS]: true,
  [ESP32Command.MAN_HEAT_START]: true,
  [ESP32Command.MAN_HEAT_STOP]: true,
  [ESP32Command.SENSOR_DATA]: false,
  [ESP32Command.STATUS_UPDATE]: false,
  [ESP32Command.ACK]: true,
  [ESP32Command.PONG]: true,
  [ESP32Command.PING]: true,
};