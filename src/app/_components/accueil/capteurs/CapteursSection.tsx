import { useEffect, useState, type FC } from "react";
import CapteursInfo, { type CapteurData } from "./CapteursInfo";
import { SENSOR_NAMES } from "@/config/sensors";

interface CapteursSectionProps {
  className?: string;
}

const CapteursSection: FC<CapteursSectionProps> = ({ className }) => {
  // Capteurs mock data state - using centralized sensor names
  const [capteursData] = useState<CapteurData[]>([
    { sensorName: SENSOR_NAMES[0], value: "85.2", unit: "°C" }, // TT-R1
    { sensorName: SENSOR_NAMES[1], value: "1.25", unit: "bar" }, // TT-R2
    { sensorName: SENSOR_NAMES[2], value: "75.8", unit: "%" }, // TT1
    { sensorName: SENSOR_NAMES[3], value: "12.5", unit: "L/min" }, // PT1
    { sensorName: SENSOR_NAMES[4], value: "ON", unit: "" }, // LV1
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
