"use client";

import { useEffect, useState, type FC, useMemo } from "react";
import { useStale } from "@/app/_hooks/useStale";
import { SensorsInfo, type SensorData } from "./SensorsInfo";
import { ESP32Command, type SensorReading } from "@/server/esp32-serial-protocol/types";
import { useESP32Communication } from "@/app/_hooks/useESP32Communication";

interface SensorsSectionProps {
  className?: string;
}
const STALE_THRESHOLD_MS = 3000;

export const SensorsSection: FC<SensorsSectionProps> = ({ className }) => {
  const { lastMessage } = useESP32Communication();
  const [lastSensorTimestamp, setLastSensorTimestamp] = useState<number>(Date.now());
  const isStale = useStale(lastSensorTimestamp, STALE_THRESHOLD_MS);

  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  useEffect(() => {
    if (lastMessage?.type === ESP32Command.SENSOR_DATA && lastMessage.sensors) {
      setLastSensorTimestamp(Date.now());
      setSensorReadings(lastMessage.sensors);
    }
  }, [lastMessage]);

  const sensorsData: SensorData[] = useMemo(
    () =>
      sensorReadings.map(sensor => ({
        sensorName: sensor.sensorName,
        value: sensor.error ? "-" : sensor.readingValue.toFixed(sensor.unit === "bar" ? 2 : 1),
        unit: sensor.unit,
      })),
    [sensorReadings]
  );

  const [isRecording, setIsRecording] = useState(true);

  useEffect(() => {
    setIsRecording(true);
  }, []);

  return (
    <SensorsInfo
      data={sensorsData}
      isRecording={isRecording}
      isStale={isStale}
      className={className}
    />
  );
};
