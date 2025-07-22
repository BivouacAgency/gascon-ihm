import { z } from "zod";
import { ManHeatStartDataSchema } from "./man-heat-start";
import { ESP32Command } from "../types";

// This file contains the schemas for the UI command
// Frontend -> ESP32

// Schema for the UI command
export const UICommandSchema = z.object({
  // Payload of the command
  payload: z.union([
    z.object({
      action: z.literal(ESP32Command.PING),
    }),
    z.object({
      action: z.literal(ESP32Command.MAN_HEAT_START),
      data: ManHeatStartDataSchema,
    }),
    z.object({
      action: z.literal(ESP32Command.MAN_HEAT_STOP),
    }),
  ]),
});

export type UICommand = z.infer<typeof UICommandSchema>; 