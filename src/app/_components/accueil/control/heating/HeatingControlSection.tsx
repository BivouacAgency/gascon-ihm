"use client";

import { useState, type FC } from "react";
import { HeatingSettingsModal } from "./HeatingSettingsModal";
import { HeatingControlInfo } from "./HeatingControlInfo";
import { ControlSectionWrapper } from "../ControlSectionWrapper";
import { R1R2Options, type HeatingData } from "@/types/HeatingData";
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
    R1R2: R1R2Options[0],
    currentTemperature: 78,
    isPlaying: false,
    capteur: "TT-R1",
  });

  const handlePlayToggle = () => {
    const newIsPlaying = !heatingData.isPlaying;

    if (newIsPlaying) {
      const durationInMiliseconds =
        heatingData.durationSet.minute * 60 * 1000 +
        heatingData.durationSet.second * 1000;

      sendCommand({
        type: "command",
        payload: {
          action: "man_heat_start",
          data: {
            durationSet: durationInMiliseconds,
            temperatureSet: heatingData.temperatureSet,
            capteur: heatingData.capteur,
            R1R2: heatingData.R1R2,
          },
        },
      });
    } else {
      sendCommand({
        type: "command",
        payload: {
          action: "man_heat_stop",
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
