"use client";

import { useState, type FC } from "react";
import { HeatingSettingsModal } from "./HeatingSettingsModal";
import { HeatingControlInfo } from "./HeatingControlInfo";
import { ControlSectionWrapper } from "../ControlSectionWrapper";
import type { HeatingData } from "@/types/HeatingData";
import { useESP32Communication } from "@/hooks/useESP32Communication";
import { Time } from "@internationalized/date";

interface HeatingControlSectionProps {
  className?: string;
}

export const HeatingControlSection: FC<HeatingControlSectionProps> = ({
  className,
}) => {
  const { sendCommand } = useESP32Communication();

  const [heatingData, setHeatingData] = useState<HeatingData>({
    temperatureSet: 80,
    durationSet: new Time(0, 45, 0), // 45 minutes, 0 seconds
    elapsedTime: new Time(0, 8, 30),
    isR1PlusR2: true,
    temperatureActual: 78,
    isPlaying: false,
    capteur: "TT-R1",
  });

  const handlePlayToggle = () => {
    const newIsPlaying = !heatingData.isPlaying;

    // If toggling to play, send heating data to backend
    if (newIsPlaying) {
      // Convert Time objects to total miliseconds for the backend
      const durationInMiliseconds =
        heatingData.durationSet.minute * 60 * 1000 +
        heatingData.durationSet.second * 1000;

      sendCommand({
        type: "command",
        payload: {
          action: "start_heating",
          data: {
            durationSet: durationInMiliseconds,
            temperatureSet: heatingData.temperatureSet,
            capteur: heatingData.capteur,
            isR1PlusR2: heatingData.isR1PlusR2,
          },
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
