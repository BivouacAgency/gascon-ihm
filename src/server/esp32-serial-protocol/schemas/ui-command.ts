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
    z.object({
      action: z.literal(ESP32Command.MAN_ACT),
      data: z.object({
        command: z.number().min(0).max(1),
        actuator: z.number().min(0).max(15),
      }),
    }),
  ]),
});

export type UICommand = z.infer<typeof UICommandSchema>; 