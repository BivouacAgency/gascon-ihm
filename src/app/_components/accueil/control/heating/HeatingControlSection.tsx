"use client";

import { useState, useEffect, type FC } from "react";
import { HeatingSettingsModal } from "./HeatingSettingsModal";
import { HeatingControlInfo } from "./HeatingControlInfo";
import { ControlSectionWrapper } from "../ControlSectionWrapper";
import { R1R2Options, type HeatingData, type HeatingDataSettings } from "@/types/forms/HeatingData";
import { useESP32Communication } from "@/hooks/useESP32Communication";
import { Time } from "@internationalized/date";
import { ESP32Command } from "@/server/esp32-serial-protocol/types";
import { useStale } from "@/hooks/useStale";

const HEATING_STALE_THRESHOLD_MS = 3000;

const defaultHeatingDataSettings: HeatingDataSettings = {
  temperatureSet: 80,
  durationSet: new Time(0, 45, 0),
  R1R2: R1R2Options[0],
  sensor: "TT-R1",
};

interface HeatingControlSectionProps {
  className?: string;
}

export const HeatingControlSection: FC<HeatingControlSectionProps> = ({
  className,
}) => {
  const { sendCommand, lastMessage } = useESP32Communication();
  const [heatingInProgress, setHeatingInProgress] = useState(false);
  const [heatingStartTimestamp, setHeatingStartTimestamp] = useState<number | undefined>(undefined);
  const [heatingDataSettings, setHeatingDataSettings] = useState<HeatingDataSettings>(defaultHeatingDataSettings);
  const [heatingData, setHeatingData] = useState<HeatingData>({ ...defaultHeatingDataSettings, elapsedTime: new Time(0, 0, 0), currentTemperature: 0 });

  const [lastHeatStatusTimestamp, setLastHeatStatusTimestamp] = useState<number>(Date.now());
  const isHeatStatusStale = useStale(lastHeatStatusTimestamp, HEATING_STALE_THRESHOLD_MS);

  useEffect(() => {
    if (lastMessage?.type === ESP32Command.MAN_HEAT_STATUS) {
      if (!heatingInProgress) {
        setHeatingInProgress(lastMessage.active === 1);
        setHeatingStartTimestamp(lastMessage.timestamp);
      }
      setLastHeatStatusTimestamp(Date.now());
      const elapsedTime = heatingStartTimestamp
        ? (() => {
            const elapsedMs = lastMessage.timestamp - heatingStartTimestamp;
            const totalSeconds = Math.floor(elapsedMs / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return new Time(0, minutes, seconds);
          })()
        : new Time(0, 0, 0);
      setHeatingData({
        ...heatingDataSettings,
        currentTemperature: lastMessage.current,
        elapsedTime,
      });
    }
  }, [lastMessage, heatingInProgress, heatingDataSettings, heatingStartTimestamp]);

  const handlePlayToggle = () => {
    const newIsPlaying = !heatingInProgress;

    if (newIsPlaying) {
      const durationInMiliseconds =
        heatingDataSettings.durationSet.minute * 60 * 1000 +
        heatingDataSettings.durationSet.second * 1000;

      sendCommand({
        type: "command",
        payload: {
          action: ESP32Command.MAN_HEAT_START,
          data: {
            durationSet: durationInMiliseconds,
            temperatureSet: heatingDataSettings.temperatureSet,
            sensor: heatingDataSettings.sensor,
            R1R2: heatingDataSettings.R1R2,
          },
        },
      });
    } else {
      sendCommand({
        type: "command",
        payload: {
          action: ESP32Command.MAN_HEAT_STOP,
        },
      });
      setHeatingData({ ...defaultHeatingDataSettings, elapsedTime: new Time(0, 0, 0), currentTemperature: 0 });
      setHeatingInProgress(false);
      setHeatingStartTimestamp(undefined);
    }

    setHeatingDataSettings({ ...heatingDataSettings });
  };

  const handleSaveSettings = (newData: HeatingDataSettings) => {
    setHeatingDataSettings(newData);
    setHeatingData({ ...newData, elapsedTime: new Time(0, 0, 0), currentTemperature: 0 });
  };

  return (
    <>
      <ControlSectionWrapper
        title="Chauffe"
        settingsModal={
          <HeatingSettingsModal data={heatingDataSettings} onSave={handleSaveSettings} />
        }
        playControl={{
          isPlaying: heatingInProgress,
          onPlayToggle: handlePlayToggle,
        }}
        infoComponent={<HeatingControlInfo data={heatingData} />}
        className={className}
      />
      {heatingInProgress && isHeatStatusStale && (
        <div className="mt-1 text-sm text-red-400">
          ⚠️ Pas de données récentes
        </div>
      )}
    </>
  );
};
