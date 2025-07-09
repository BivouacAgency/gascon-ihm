"use client";

import { useState, type FC } from "react";
import { EngineControlInfo } from "./EngineControlInfo";
import { ControlSectionWrapper } from "../ControlSectionWrapper";
import type { EngineData } from "@/types/EngineData";

interface EngineControlSectionProps {
  className?: string;
}

export const EngineControlSection: FC<EngineControlSectionProps> = ({
  className,
}) => {
  const [engineData] = useState<EngineData>({
    m1Status: false,
    ev1Status: false,
    ev2Status: false,
    ev3Status: false,
  });

  return (
    <ControlSectionWrapper
      title="Moteur"
      infoComponent={<EngineControlInfo data={engineData} />}
      className={className}
    />
  );
};
