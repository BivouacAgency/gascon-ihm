"use client";

import { useEffect, useState, type FC, useMemo } from "react";
import { useStale } from "@/hooks/useStale";
import { SensorsInfo, type SensorData } from "./SensorsInfo";
import type { SensorReading } from "@/server/esp32-serial-protocol/types";
import { useESP32Communication } from "@/hooks/useESP32Communication";

interface SensorsSectionProps {
  className?: string;
}
// Time threshold (ms) to consider data stale
const STALE_THRESHOLD_MS = 3000;

export const SensorsSection: FC<SensorsSectionProps> = ({ className }) => {
  const { lastMessage } = useESP32Communication();
  const [lastSensorTimestamp, setLastSensorTimestamp] = useState<number>(Date.now());
  // derive stale status from hook
  const isStale = useStale(lastSensorTimestamp, STALE_THRESHOLD_MS);

  // stale detection is now handled by useStale hook

  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  useEffect(() => {
    if (lastMessage?.type === "SENSOR_DATA" && lastMessage.sensors) {
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
