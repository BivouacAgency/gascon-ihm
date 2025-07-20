export const SENSOR_NAMES = ["TT-R1", "TT-R2", "TT1", "PT1", "LV1"] as const;

export type SensorName = (typeof SENSOR_NAMES)[number];
