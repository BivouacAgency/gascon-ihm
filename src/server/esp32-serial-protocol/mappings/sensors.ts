import type { SENSORS } from "@/config/form-settings/sensors/config";

// This file contains the mappings for the sensors
// Maps the frontend options to the ESP32 bitmask

// Frontend -> ESP32
export const SENSOR_ID_MAP: Record<(typeof SENSORS)[number], number> = {
  "TT-R1": 0,
  "TT-R2": 1,
  "TT1": 2,
  "PT1": 3,
}; 