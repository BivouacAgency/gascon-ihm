"use client";

import { useState, type FC } from "react";
import { HeatingSettingsModal } from "./HeatingSettingsModal";
import { HeatingControlInfo } from "./HeatingControlInfo";
import { ControlSectionWrapper } from "../ControlSectionWrapper";
import type { HeatingData } from "@/types/HeatingData";
import { useESP32Communication } from "@/hooks/useESP32Communication";

interface HeatingControlSectionProps {
  className?: string;
}

export const HeatingControlSection: FC<HeatingControlSectionProps> = ({
  className,
}) => {
  const { sendCommand } = useESP32Communication();

  const [heatingData, setHeatingData] = useState<HeatingData>({
    temperatureSet: 80,
    durationSet: 45,
    elapsedTime: 8 * 60 + 30, // 8:30 in seconds (8 minutes 30 seconds)
    isR1PlusR2: true,
    temperatureActual: 78,
    isPlaying: false,
    capteur: "TT-R1",
  });

  const handlePlayToggle = () => {
    const newIsPlaying = !heatingData.isPlaying;

    // If toggling to play, send heating data to backend
    if (newIsPlaying) {
      sendCommand({
        type: "command",
        payload: {
          action: "start_heating",
          data: heatingData,
        },
      });
    } else {
      sendCommand({
        type: "command",
        payload: {
          action: "stop_heating",
        },
      });
    }

    setHeatingData({ ...heatingData, isPlaying: newIsPlaying });
  };

  const handleSaveSettings = (newData: HeatingData) => {
    setHeatingData(newData);
  };

  return (
    <ControlSectionWrapper
      title="Chauffe"
      settingsModal={
        <HeatingSettingsModal data={heatingData} onSave={handleSaveSettings} />
      }
      playControl={{
        isPlaying: heatingData.isPlaying,
        onPlayToggle: handlePlayToggle,
      }}
      infoComponent={<HeatingControlInfo data={heatingData} />}
      className={className}
    />
  );
};
