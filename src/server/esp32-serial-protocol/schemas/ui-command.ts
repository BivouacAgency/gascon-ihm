import { z } from "zod";
import { ManHeatStartDataSchema } from "./man-heat-start";
import { ESP32Command } from "../types";

// Frontend -> ESP32

export const UICommandSchema = z.object({
  type: z.enum(["command", "config"]),
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