import { SENSOR_NAMES } from "../../../config/sensors/config";

export const SENSOR_ID_MAP: Record<(typeof SENSOR_NAMES)[number], number> = {
  "TT-R1": 0,
  "TT-R2": 1,
  "TT1": 2,
  "PT1": 3,
  "LV1": 4,
}; 