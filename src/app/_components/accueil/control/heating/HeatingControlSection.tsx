"use client";

import { useState, type FC } from "react";
import { HeatingSettingsModal } from "./HeatingSettingsModal";
import { HeatingControlInfo } from "./HeatingControlInfo";
import { ControlSectionWrapper } from "../ControlSectionWrapper";
import type { HeatingData } from "@/types/HeatingData";

interface HeatingControlSectionProps {
  className?: string;
}

export const HeatingControlSection: FC<HeatingControlSectionProps> = ({
  className,
}) => {
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
    // BACKEND: send request to start/stop the program
    setHeatingData({ ...heatingData, isPlaying: !heatingData.isPlaying });
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
