"use client";

import { useState, useEffect, type FC } from "react";
import { HeatingSettingsModal } from "./HeatingSettingsModal";
import { HeatingControlInfo } from "./HeatingControlInfo";
import { ControlSectionWrapper } from "../ControlSectionWrapper";
import { R1R2Options, type HeatingData, type HeatingSettings } from "@/types/forms/HeatingData";
import { useESP32Communication } from "@/hooks/useESP32Communication";
import { Time } from "@internationalized/date";
import { ESP32Command } from "@/server/esp32-serial-protocol/types";
import { useStale } from "@/hooks/useStale";

// Constants
const HEATING_STALE_THRESHOLD_MS = 3000;

// Default settings for the heating control section
const defaultHeatingSettings: HeatingSettings = {
  temperatureSet: 80,
  durationSet: new Time(0, 45, 0),
  R1R2: R1R2Options[0],
  sensor: "TT-R1",
};

// Props for the HeatingControlSection component
interface HeatingControlSectionProps {
  className?: string;
}

/**
 * Manages heating cycles using ESP32 commands:
 * - Sends start/stop commands via useESP32Communication
 * - Tracks progress and handles stale data warnings
 * - Allows configuring settings via HeatingSettingsModal
 */
export const HeatingControlSection: FC<HeatingControlSectionProps> = ({
  className,
}) => {
  // Hook to send/receive commands from/to the ESP32
  const { sendCommand, lastMessage } = useESP32Communication();

  // Heating related states
  const [heatingInProgress, setHeatingInProgress] = useState(false);
  const [heatingStartTimestamp, setHeatingStartTimestamp] = useState<number | undefined>(undefined);
  // Heating settings, set in the settings modal
  const [heatingSettings, setHeatingSettings] = useState<HeatingSettings>(defaultHeatingSettings);
  // Heating data, received from the ESP32
  const [heatingData, setHeatingData] = useState<HeatingData>({ ...defaultHeatingSettings, elapsedTime: 0, currentTemperature: 0 });
  // Counter for consecutive active heat status frames
  const [activeHeatStatusCount, setActiveHeatStatusCount] = useState(0);

  // Tracking the last heat status timestamp
  const [lastHeatStatusTimestamp, setLastHeatStatusTimestamp] = useState<number>(Date.now());
  const isHeatStatusStale = useStale(lastHeatStatusTimestamp, HEATING_STALE_THRESHOLD_MS);

  // Update the heating data when the last message is received
  useEffect(() => {
    if (lastMessage?.type === ESP32Command.MAN_HEAT_STATUS) {
      setLastHeatStatusTimestamp(Date.now());
      
      // Update active status counter
      if (lastMessage.active === 1) {
        setActiveHeatStatusCount(prev => prev + 1);
        if (activeHeatStatusCount >= 1) { // Wait for 2 consecutive active frames
          setHeatingInProgress(true);
          setHeatingStartTimestamp(lastMessage.timestamp);
        }
        setHeatingData({
          ...heatingSettings,
          currentTemperature: lastMessage.current,
          elapsedTime: lastMessage.elapsedTime,
        });
      } else {
        setActiveHeatStatusCount(0);
        setHeatingInProgress(false);
        setHeatingStartTimestamp(undefined);
        setHeatingData({ ...defaultHeatingSettings, elapsedTime: 0, currentTemperature: 0 });
      }
    }
    if (lastMessage?.type === ESP32Command.ACK) {
      setActiveHeatStatusCount(0);
      if (lastMessage.acknowledgedCommand === ESP32Command.MAN_HEAT_STOP) {
        setHeatingInProgress(false);
        setHeatingStartTimestamp(undefined);
        setHeatingData({ ...defaultHeatingSettings, elapsedTime: 0, currentTemperature: 0 });
      } else if (lastMessage.acknowledgedCommand === ESP32Command.MAN_HEAT_START) {
        setHeatingInProgress(true);
        // Initialize heating data with current settings to avoid visual bump
        setHeatingData({
          ...heatingSettings,
          elapsedTime: 0,
          currentTemperature: 0
        });
      }
    }
  }, [lastMessage, heatingSettings, activeHeatStatusCount]);

  // Start/stop heating callback
  const handlePlayToggle = () => {
    const newIsPlaying = !heatingInProgress;

    if (newIsPlaying) {
      const durationInMiliseconds =
        heatingSettings.durationSet.minute * 60 * 1000 +
        heatingSettings.durationSet.second * 1000;

      // Initialize heating data immediately when starting
      setHeatingData({
        ...heatingSettings,
        elapsedTime: 0,
        currentTemperature: 0
      });

      sendCommand({
        payload: {
          action: ESP32Command.MAN_HEAT_START,
          data: {
            durationSet: durationInMiliseconds,
            temperatureSet: heatingSettings.temperatureSet,
            sensor: heatingSettings.sensor,
            R1R2: heatingSettings.R1R2,
          },
        },
      });
    } else {
      sendCommand({
        payload: {
          action: ESP32Command.MAN_HEAT_STOP,
        },
      });
    }

    setHeatingSettings({ ...heatingSettings });
  };

  // Save heating settings callback
  const handleSaveSettings = (newData: HeatingSettings) => {
    setHeatingSettings(newData);
    setHeatingData({ ...newData, elapsedTime: 0, currentTemperature: 0 });
  };

  return (
    <>
      <ControlSectionWrapper
        title="Chauffe"
        settingsModal={
          <HeatingSettingsModal data={heatingSettings} onSave={handleSaveSettings} />
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
