import type { SensorName } from "@/config/sensors/config";
import type { Time } from "@internationalized/date";

export interface HeatingData {
  temperatureSet: number;
  durationSet: Time; // in minutes
  elapsedTime: Time; // in seconds (elapsed time since program start)
  isR1PlusR2: boolean;
  temperatureActual: number;
  isPlaying: boolean;
  capteur: SensorName;
}
