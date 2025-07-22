import type { R1R2_OPTIONS } from "@/config/form-settings/heaters/config";

// This file contains the mappings for the heaters
// Maps the frontend options to the ESP32 bitmask

// Frontend -> ESP32
export const HEATER_MASK_MAP: Record<(typeof R1R2_OPTIONS)[number], number> = {
  "R1": 1,   
  "R1+R2": 3,
}; 