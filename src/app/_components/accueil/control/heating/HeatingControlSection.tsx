import { useState, type FC } from "react";
import { HeatingSettingsModal } from "./HeatingSettingsModal";
import HeatingControlInfo from "./HeatingControlInfo";
import ControlSectionWrapper from "../PilotageSectionWrapper";
import type { SensorName } from "@/config/sensors";

export interface HeatingData {
  temperatureSet: number;
  durationSet: number; // in minutes
  elapsedTime: number; // in seconds (elapsed time since program start)
  isR1PlusR2: boolean;
  temperatureActual: number;
  isPlaying: boolean;
  capteur: SensorName;
}

interface HeatingControlSectionProps {
  className?: string;
}

const HeatingControlSection: FC<HeatingControlSectionProps> = ({
  className,
}) => {
  const [chauffeData, setChauffeData] = useState<HeatingData>({
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
    setChauffeData({ ...chauffeData, isPlaying: !chauffeData.isPlaying });
  };

  const handleSaveSettings = (newData: HeatingData) => {
    setChauffeData(newData);
  };

  return (
    <ControlSectionWrapper
      title="Chauffe"
      settingsModal={
        <HeatingSettingsModal data={chauffeData} onSave={handleSaveSettings} />
      }
      playControl={{
        isPlaying: chauffeData.isPlaying,
        onPlayToggle: handlePlayToggle,
      }}
      infoComponent={<HeatingControlInfo data={chauffeData} />}
      className={className}
    />
  );
};

export default HeatingControlSection;
