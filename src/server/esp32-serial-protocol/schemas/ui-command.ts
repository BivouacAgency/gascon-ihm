import { z } from "zod";
import { ManHeatStartDataSchema } from "./man-heat-start";

// Schema for UICommand structure
export const UICommandSchema = z.object({
  type: z.enum(["command", "config"]),
  payload: z.union([
    z.object({
      action: z.literal("ping"),
    }),
    z.object({
      action: z.literal("man_heat_start"),
      data: ManHeatStartDataSchema,
    }),
    z.object({
      action: z.literal("man_heat_stop"),
    }),
  ]),
});

export type UICommand = z.infer<typeof UICommandSchema>; 