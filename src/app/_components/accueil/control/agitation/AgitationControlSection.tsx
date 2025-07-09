"use client";

import { useState, type FC } from "react";
import { ControlSectionWrapper } from "../ControlSectionWrapper";
import { AgitationSettingsModal } from "./AgitationSettingsModal";
import { AgitationControlInfo } from "./AgitationControlInfo";
import type { AgitationData } from "@/types/AgitationData";

interface AgitationControlSectionProps {
  className?: string;
}

export const AgitationControlSection: FC<AgitationControlSectionProps> = ({
  className,
}) => {
  const [agitationData, setAgitationData] = useState<AgitationData>({
    speedSet: 100,
    durationSet: 15,
    elapsedTime: 0,
  });

  const [isPlaying, setIsPlaying] = useState(false);

  const onDataChange = (newData: AgitationData) => {
    setAgitationData(newData);
  };

  const handlePlayToggle = () => {
    // BACKEND: send request to start/stop the program
    setIsPlaying(!isPlaying);
  };

  return (
    <ControlSectionWrapper
      title="Agitation"
      settingsModal={
        <AgitationSettingsModal data={agitationData} onSave={onDataChange} />
      }
      infoComponent={<AgitationControlInfo data={agitationData} />}
      playControl={{
        isPlaying,
        onPlayToggle: handlePlayToggle,
      }}
      className={className}
    />
  );
};
