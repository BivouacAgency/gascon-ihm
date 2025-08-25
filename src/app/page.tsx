import { Card } from "@/app/_components/ui/card";
import { AgitationControlSection } from "./_components/accueil/control/agitation/AgitationControlSection";
import { EngineControlSection } from "./_components/accueil/control/engine/EngineControlSection";
import { HeatingControlSection } from "./_components/accueil/control/heating/HeatingControlSection";
import { SensorsSection } from "./_components/accueil/sensors/SensorsSection";
import { InformationSection } from "./_components/accueil/InformationSection";

export default function Home() {
  return (
    <div className="bg-grey h-full p-4">
      <div className="flex h-full flex-col gap-4 md:flex-row">
        <div className="flex min-w-128 flex-col gap-4">
          <Card className="flex flex-col gap-4">
            <HeatingControlSection />
          </Card>
          <Card className="flex flex-col gap-4">
            <AgitationControlSection />
          </Card>
          <Card className="grow">
            <InformationSection />
          </Card>
        </div>

        <div className="flex min-w-0 flex-grow basis-0 flex-col gap-4">
          <Card className="flex flex-col gap-4">
            <EngineControlSection />
          </Card>
          <Card>
            <SensorsSection className="grow" />
          </Card>
        </div>
      </div>
    </div>
  );
}
