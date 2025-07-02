import { useState, type FC } from "react";
import PilotageMoteurInfo from "./PilotageMoteurInfo";
import PilotageSectionWrapper from "../PilotageSectionWrapper";

export interface MoteurData {
  m1Status: boolean;
  ev1Status: boolean;
  ev2Status: boolean;
  ev3Status: boolean;
}

interface PilotageMoteurSectionProps {
  className?: string;
}

const PilotageMoteurSection: FC<PilotageMoteurSectionProps> = ({
  className,
}) => {
  const [moteurData] = useState<MoteurData>({
    m1Status: false,
    ev1Status: false,
    ev2Status: false,
    ev3Status: false,
  });

  return (
    <PilotageSectionWrapper
      title="Moteur"
      infoComponent={<PilotageMoteurInfo data={moteurData} />}
      className={className}
    />
  );
};

export default PilotageMoteurSection;
