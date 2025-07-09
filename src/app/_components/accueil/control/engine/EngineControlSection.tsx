"use client";

import { useState, type FC } from "react";
import EngineControlInfo from "./EngineControlInfo";
import ControlSectionWrapper from "../PilotageSectionWrapper";

export interface EngineData {
  m1Status: boolean;
  ev1Status: boolean;
  ev2Status: boolean;
  ev3Status: boolean;
}

interface EngineControlSectionProps {
  className?: string;
}

const EngineControlSection: FC<EngineControlSectionProps> = ({ className }) => {
  const [moteurData] = useState<EngineData>({
    m1Status: false,
    ev1Status: false,
    ev2Status: false,
    ev3Status: false,
  });

  return (
    <ControlSectionWrapper
      title="Moteur"
      infoComponent={<EngineControlInfo data={moteurData} />}
      className={className}
    />
  );
};

export default EngineControlSection;
