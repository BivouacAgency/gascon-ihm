import { cn } from "@/lib/utils";
import { type FC } from "react";
import PilotageChauffeSection from "./chauffe/PilotageChauffeSection";
import PilotageAgitateurSection from "./agitateur/PilotageAgitateurSection";

interface PilotageSectionProps {
  className?: string;
}

const PilotageSection: FC<PilotageSectionProps> = ({ className }) => {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <PilotageChauffeSection />
      <PilotageAgitateurSection />

      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Moteur</h3>
      </div>
    </div>
  );
};

export default PilotageSection;
