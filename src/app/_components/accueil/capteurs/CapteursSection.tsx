import { useEffect, useState, type FC } from "react";
import CapteursInfo, { type CapteurData } from "./CapteursInfo";

interface CapteursSectionProps {
  className?: string;
}

const CapteursSection: FC<CapteursSectionProps> = ({ className }) => {
  // Capteurs mock data state
  const [capteursData] = useState<CapteurData[]>([
    { sensorName: "RR-R1", value: "85.2", unit: "°C" },
    { sensorName: "TT-R2", value: "1.25", unit: "bar" },
    { sensorName: "TT1", value: "75.8", unit: "%" },
    { sensorName: "PT1", value: "12.5", unit: "L/min" },
    { sensorName: "LV1", value: "ON", unit: "" },
  ]);

  // Global capteurs status
  const [isRecording, setIsRecording] = useState(true);

  useEffect(() => {
    setIsRecording(true);
  }, []);

  return (
    <CapteursInfo
      data={capteursData}
      isRecording={isRecording}
      className={className}
    />
  );
};

export default CapteursSection;
