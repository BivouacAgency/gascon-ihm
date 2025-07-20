import { z } from "zod";
import { SENSOR_NAMES } from "../../../config/sensors/config";
import { R1R2_OPTIONS } from "../../../config/heaters/config";

export const TemperatureSchema = z.number().min(30).max(120);
export const DurationSchema = z.number().positive().max(59 * 3600 + 59 * 1000); // 59 min & 59 seconds
export const R1R2Schema = z.enum(R1R2_OPTIONS);

export const SensorNameSchema = z.enum(SENSOR_NAMES);

export const ManHeatStartDataSchema = z.object({
  temperatureSet: TemperatureSchema,
  durationSet: DurationSchema,
  capteur: SensorNameSchema,
  R1R2: R1R2Schema,
});

export type ManHeatStartData = z.infer<typeof ManHeatStartDataSchema>; 