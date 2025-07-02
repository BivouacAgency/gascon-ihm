import { cn } from "@/lib/utils";
import { type FC } from "react";
import PilotageChauffeSection from "./chauffe/PilotageChauffeSection";
import PilotageAgitationSection from "./agitation/PilotageAgitationSection";

interface PilotageSectionProps {
  className?: string;
}

const PilotageSection: FC<PilotageSectionProps> = ({ className }) => {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <PilotageChauffeSection />
      <PilotageAgitationSection />

      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Moteur</h3>
      </div>
    </div>
  );
};

export default PilotageSection;
