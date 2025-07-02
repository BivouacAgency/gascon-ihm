import { cn } from "@/lib/utils";
import { type FC } from "react";
import PilotageChauffeSection from "./chauffe/PilotageChauffeSection";
import PilotageAgitationSection from "./agitation/PilotageAgitationSection";
import PilotageMoteurSection from "./moteur/PilotageMoteurSection";

interface PilotageSectionProps {
  className?: string;
}

const PilotageSection: FC<PilotageSectionProps> = ({ className }) => {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <PilotageChauffeSection />
      <PilotageAgitationSection />
      <PilotageMoteurSection />
    </div>
  );
};

export default PilotageSection;
