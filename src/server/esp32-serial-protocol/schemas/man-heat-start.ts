import { R1R2_OPTIONS } from "@/config/form-settings/heaters/config";
import { SENSORS } from "@/config/form-settings/sensors/config";
import { z } from "zod";

// This file contains the schemas for the man-heat-start command
// Frontend -> ESP32

// Schemas for the man-heat-start settings
export const TemperatureSchema = z.number().min(30).max(120);
export const DurationSchema = z.number().positive().max(59 * 3600000 + 59 * 1000); // 59 min & 59 seconds
export const R1R2Schema = z.enum(R1R2_OPTIONS);
export const SensorNameSchema = z.enum(SENSORS);

// Schema for the man-heat-start command
export const ManHeatStartDataSchema = z.object({
  temperatureSet: TemperatureSchema,
  durationSet: DurationSchema,
  sensor: SensorNameSchema,
  R1R2: R1R2Schema,
});

export type ManHeatStartData = z.infer<typeof ManHeatStartDataSchema>; 