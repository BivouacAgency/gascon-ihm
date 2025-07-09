"use client";

import { useEffect, useState, type FC } from "react";
import { SENSOR_NAMES } from "@/config/sensors/config";
import { SensorsInfo, type SensorData } from "./SensorsInfo";

interface SensorsSectionProps {
  className?: string;
}

export const SensorsSection: FC<SensorsSectionProps> = ({ className }) => {
  // Sensors mock data state - using centralized sensor names
  const [sensorsData] = useState<SensorData[]>([
    { sensorName: SENSOR_NAMES[0], value: "85.2", unit: "°C" }, // TT-R1
    { sensorName: SENSOR_NAMES[1], value: "1.25", unit: "bar" }, // TT-R2
    { sensorName: SENSOR_NAMES[2], value: "75.8", unit: "%" }, // TT1
    { sensorName: SENSOR_NAMES[3], value: "12.5", unit: "L/min" }, // PT1
    { sensorName: SENSOR_NAMES[4], value: "ON", unit: "" }, // LV1
  ]);

  // Global sensors status
  const [isRecording, setIsRecording] = useState(true);

  useEffect(() => {
    setIsRecording(true);
  }, []);

  return (
    <SensorsInfo
      data={sensorsData}
      isRecording={isRecording}
      className={className}
    />
  );
};
