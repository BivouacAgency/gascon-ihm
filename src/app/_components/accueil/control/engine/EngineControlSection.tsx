"use client";

import { useState, type FC } from "react";
import { EngineControlInfo } from "./EngineControlInfo";
import { ControlSectionWrapper } from "../ControlSectionWrapper";
import type { EngineData } from "@/types/forms/EngineData";

// Props for the EngineControlSection component
interface EngineControlSectionProps {
  className?: string;
}

/**
 * Wraps EngineControlInfo in a ControlSectionWrapper:
 * - Displays engine and valve controls
 * - Provides consistent layout with title and optional controls
 */
export const EngineControlSection: FC<EngineControlSectionProps> = ({
  className,
}) => {
  // Initial state
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
