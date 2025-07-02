import { useState, type FC } from "react";
import AgitateurSettingsModal from "./AgitateurSettingsModal";
import PilotageAgitateurInfo from "./PilotageAgitateurInfo";
import PilotageSectionWrapper from "../PilotageSectionWrapper";

export interface AgitateurData {
  speedSet: number;
  durationSet: number;
  elapsedTime: number;
}

interface PilotageAgitateurSectionProps {
  className?: string;
}

const PilotageAgitateurSection: FC<PilotageAgitateurSectionProps> = ({
  className,
}) => {
  const [agitateurData, setAgitateurData] = useState<AgitateurData>({
    speedSet: 100,
    durationSet: 15,
    elapsedTime: 0,
  });

  const [isPlaying, setIsPlaying] = useState(false);

  const onDataChange = (newData: AgitateurData) => {
    setAgitateurData(newData);
  };

  return (
    <PilotageSectionWrapper
      title="Agitation"
      settingsModal={
        <AgitateurSettingsModal data={agitateurData} onSave={onDataChange} />
      }
      infoComponent={<PilotageAgitateurInfo data={agitateurData} />}
      isPlaying={isPlaying}
      onPlayToggle={() => setIsPlaying(!isPlaying)}
      className={className}
    />
  );
};

export default PilotageAgitateurSection;
