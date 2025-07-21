import { R1R2_OPTIONS } from "../../../config/heaters/config";

// Frontend -> ESP32

export const HEATER_MASK_MAP: Record<(typeof R1R2_OPTIONS)[number], number> = {
  "R1": 1,   
  "R1+R2": 3,
}; 