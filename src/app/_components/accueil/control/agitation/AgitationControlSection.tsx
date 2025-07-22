"use client";

import { useState, type FC } from "react";
import { ControlSectionWrapper } from "../ControlSectionWrapper";
import { AgitationSettingsModal } from "./AgitationSettingsModal";
import { AgitationControlInfo } from "./AgitationControlInfo";
import type { AgitationData } from "@/types/forms/AgitationData";
import { Time } from "@internationalized/date";

// Props for the AgitationControlSection component
interface AgitationControlSectionProps {
  className?: string;
}

/**
 * Composes the agitation control section UI:
 * - settingsModal: configures speed and duration
 * - infoComponent: shows current settings and progress
 * - playControl: toggles agitation on/off
 */
export const AgitationControlSection: FC<AgitationControlSectionProps> = ({
  className,
}) => {
  // Initial state
  const [agitationData, setAgitationData] = useState<AgitationData>({
    speedSet: 100,
    durationSet: new Time(0, 15, 0),
    elapsedTime: new Time(0, 0, 0),
  });

  // State for the play/pause button
  const [isPlaying, setIsPlaying] = useState(false);

  // Callback to update the agitation data
  const onDataChange = (newData: AgitationData) => {
    setAgitationData(newData);
  };

  // Callback to toggle the play/pause button
  const handlePlayToggle = () => {
    // BACKEND TODO: send request to start/stop the program
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
