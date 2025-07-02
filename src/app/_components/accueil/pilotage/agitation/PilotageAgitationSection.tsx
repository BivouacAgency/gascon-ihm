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

const PilotageAgitateurSection: FC<PilotageAgitationSectionProps> = ({
  className,
}) => {
  const [agitateurData, setAgitateurData] = useState<AgitationData>({
    speedSet: 100,
    durationSet: 15,
    elapsedTime: 0,
  });

  const [isPlaying, setIsPlaying] = useState(false);

  const onDataChange = (newData: AgitationData) => {
    setAgitateurData(newData);
  };

  return (
    <PilotageSectionWrapper
      title="Agitation"
      settingsModal={
        <AgitationSettingsModal data={agitateurData} onSave={onDataChange} />
      }
      infoComponent={<PilotageAgitationInfo data={agitateurData} />}
      isPlaying={isPlaying}
      onPlayToggle={() => setIsPlaying(!isPlaying)}
      className={className}
    />
  );
};

export default PilotageAgitateurSection;
