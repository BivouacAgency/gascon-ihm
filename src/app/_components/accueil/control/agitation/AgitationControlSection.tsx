"use client";

import { useState, type FC } from "react";
import ControlSectionWrapper from "../PilotageSectionWrapper";
import { AgitationSettingsModal } from "./AgitationSettingsModal";
import AgitationControlInfo from "./AgitationControlInfo";

export interface AgitationData {
  speedSet: number;
  durationSet: number;
  elapsedTime: number;
}

interface AgitationControlSectionProps {
  className?: string;
}

const AgitationControlSection: FC<AgitationControlSectionProps> = ({
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

export default AgitationControlSection;
