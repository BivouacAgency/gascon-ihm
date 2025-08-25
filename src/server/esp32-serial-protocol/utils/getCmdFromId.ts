import { CMD_IDS, type ESP32Command } from "../types";

export const getCmdFromId = (id: number): ESP32Command => {
  return Object.entries(CMD_IDS).find(
    ([_, cmdId]) => cmdId === id,
  )?.[0] as ESP32Command;
};
