import { SENSORS } from "@/config/form-settings/sensors/config";
import { Time } from "@internationalized/date";
import { z } from "zod";

// This file contains the schema for the heating data

// R1R2 options
export const R1R2Options = ["R1", "R1+R2"] as const;

// Schema for the heating data
export const HeatingDataSchema = z.object({
  sensor: z.enum(SENSORS),
  temperatureSet: z.number(),
  durationSet: z.custom<Time>((value) => value instanceof Time),
  elapsedTime: z.custom<Time>((value) => value instanceof Time),
  R1R2: z.enum(R1R2Options),
  currentTemperature: z.number(),
});

export type HeatingData = z.infer<typeof HeatingDataSchema>;
export type HeatingSettings = Omit<HeatingData, 'currentTemperature' | 'elapsedTime'>;
