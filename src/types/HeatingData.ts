import { SENSOR_NAMES } from "@/config/sensors/config";
import { Time } from "@internationalized/date";
import { z } from "zod";

export const R1R2Options = ["R1", "R1+R2"] as const;

export const HeatingDataSchema = z.object({
  capteur: z.enum(SENSOR_NAMES),
  temperatureSet: z.number(),
  durationSet: z.custom<Time>((value) => value instanceof Time),
  elapsedTime: z.custom<Time>((value) => value instanceof Time),
  R1R2: z.enum(R1R2Options),
  currentTemperature: z.number(),
  isPlaying: z.boolean(),
});

export type HeatingData = z.infer<typeof HeatingDataSchema>;
