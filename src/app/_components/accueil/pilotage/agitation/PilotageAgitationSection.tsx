import { useState, type FC } from "react";
import PilotageSectionWrapper from "../PilotageSectionWrapper";
import { AgitationSettingsModal } from "./AgitationSettingsModal";
import PilotageAgitationInfo from "./PilotageAgitationInfo";

export interface AgitationData {
  speedSet: number;
  durationSet: number;
  elapsedTime: number;
}

interface PilotageAgitationSectionProps {
  className?: string;
}

const PilotageAgitationSection: FC<PilotageAgitationSectionProps> = ({
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
    <PilotageSectionWrapper
      title="Agitation"
      settingsModal={
        <AgitationSettingsModal data={agitationData} onSave={onDataChange} />
      }
      infoComponent={<PilotageAgitationInfo data={agitationData} />}
      playControl={{
        isPlaying,
        onPlayToggle: handlePlayToggle,
      }}
      className={className}
    />
  );
};

export default PilotageAgitationSection;
