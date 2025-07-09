import type { SensorName } from "@/config/sensors/config";

export interface HeatingData {
  temperatureSet: number;
  durationSet: number; // in minutes
  elapsedTime: number; // in seconds (elapsed time since program start)
  isR1PlusR2: boolean;
  temperatureActual: number;
  isPlaying: boolean;
  capteur: SensorName;
}
