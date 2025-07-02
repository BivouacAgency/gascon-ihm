import { useState, type FC } from "react";
import { ChauffeSettingsModal } from "./ChauffeSettingsModal";
import PilotageChauffeInfo from "./PilotageChauffeInfo";
import PilotageSectionWrapper from "../PilotageSectionWrapper";

export interface ChauffeData {
  temperatureSet: number;
  durationSet: number; // in minutes
  elapsedTime: number; // in seconds (elapsed time since program start)
  isR1PlusR2: boolean;
}

interface PilotageChauffeSectionProps {
  className?: string;
}

const PilotageChauffeSection: FC<PilotageChauffeSectionProps> = ({
  className,
}) => {
  const [chauffeData, setChauffeData] = useState<ChauffeData>({
    temperatureSet: 90,
    durationSet: 15,
    elapsedTime: 8 * 60 + 30, // 8:30 in seconds (8 minutes 30 seconds)
    isR1PlusR2: false,
  });

  const [isPlaying, setIsPlaying] = useState(false);

  const onDataChange = (newData: ChauffeData) => {
    setChauffeData(newData);
  };

  return (
    <PilotageSectionWrapper
      title="Chauffe"
      settingsModal={
        <ChauffeSettingsModal data={chauffeData} onSave={onDataChange} />
      }
      infoComponent={<PilotageChauffeInfo data={chauffeData} />}
      playControl={{
        isPlaying,
        onPlayToggle: () => setIsPlaying(!isPlaying),
      }}
      className={className}
    />
  );
};

export default PilotageChauffeSection;
