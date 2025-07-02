import { useState, type FC } from "react";
import { ChauffeSettingsModal } from "./ChauffeSettingsModal";
import PilotageChauffeInfo from "./PilotageChauffeInfo";
import PilotageSectionWrapper from "../PilotageSectionWrapper";
import type { SensorName } from "@/config/sensors";

export interface ChauffeData {
  temperatureSet: number;
  durationSet: number; // in minutes
  elapsedTime: number; // in seconds (elapsed time since program start)
  isR1PlusR2: boolean;
  temperatureActual: number;
  isPlaying: boolean;
  capteur: SensorName;
}

interface PilotageChauffesSectionProps {
  className?: string;
}

const PilotageChauffeSection: FC<PilotageChauffesSectionProps> = ({
  className,
}) => {
  const [chauffeData, setChauffeData] = useState<ChauffeData>({
    temperatureSet: 80,
    durationSet: 45,
    elapsedTime: 8 * 60 + 30, // 8:30 in seconds (8 minutes 30 seconds)
    isR1PlusR2: true,
    temperatureActual: 78,
    isPlaying: true,
    capteur: "TT-R1",
  });

  const handlePlayToggle = () => {
    setChauffeData({ ...chauffeData, isPlaying: !chauffeData.isPlaying });
  };

  const handleSaveSettings = (newData: ChauffeData) => {
    setChauffeData(newData);
  };

  return (
    <PilotageSectionWrapper
      title="Chauffe"
      settingsModal={
        <ChauffeSettingsModal data={chauffeData} onSave={handleSaveSettings} />
      }
      playControl={{
        isPlaying: chauffeData.isPlaying,
        onPlayToggle: handlePlayToggle,
      }}
      infoComponent={<PilotageChauffeInfo data={chauffeData} />}
      className={className}
    />
  );
};

export default PilotageChauffeSection;
