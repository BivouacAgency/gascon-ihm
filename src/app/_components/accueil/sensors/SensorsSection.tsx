"use client";

import { useEffect, useState, type FC, useMemo } from "react";
import { SensorsInfo, type SensorData } from "./SensorsInfo";
import type { SensorReading } from "@/server/esp32-serial-protocol/types";
import { useESP32Communication } from "@/hooks/useESP32Communication";

interface SensorsSectionProps {
  className?: string;
}

const MAX_MISSED_UPDATES = 2;

export const SensorsSection: FC<SensorsSectionProps> = ({ className }) => {
  const [missedUpdates, setMissedUpdates] = useState(0);
  const { lastMessage } = useESP32Communication();

  useEffect(() => {
    if (lastMessage == null) return;
    if (lastMessage.type === "SENSOR_DATA") {
      setMissedUpdates(0);
    } else {
      setMissedUpdates((count) => count + 1);
    }
  }, [lastMessage]);

  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  useEffect(() => {
    if (lastMessage?.type === "SENSOR_DATA" && lastMessage.sensors) {
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

  const isStale = missedUpdates >= MAX_MISSED_UPDATES;

  return (
    <SensorsInfo
      data={sensorsData}
      isRecording={isRecording}
      isStale={isStale}
      className={className}
    />
  );
};
