import Image from "next/image";
import { Card } from "@/components/ui/card";
import AgitationControlSection from "./_components/accueil/control/agitation/AgitationControlSection";
import EngineControlSection from "./_components/accueil/control/engine/EngineControlSection";
import HeatingControlSection from "./_components/accueil/control/heating/HeatingControlSection";
import SensorsSection from "./_components/accueil/sensors/SensorsSection";

export default function Home() {
  return (
    <div className="bg-grey h-full p-4">
      <div className="flex h-full gap-4">
        <div className="flex min-w-96 flex-col gap-4">
          <Card className="flex flex-col gap-4">
            <HeatingControlSection />
            <AgitationControlSection />
            <EngineControlSection />
          </Card>

          <Card className="grow">
            <SensorsSection />
          </Card>
        </div>

        <div className="flex w-80 min-w-0 flex-grow basis-0 flex-col gap-4">
          <Card className="relative flex-grow overflow-hidden">
            <Image
              src="/image_cuve_gascon_tmp.jpg"
              alt="Cuve"
              width={2432}
              height={1664}
              className="h-full w-full object-cover"
            />
          </Card>

          <Card>
            <p className="text-center leading-relaxed text-white">
              Lorem ipsum dolor: sit amet consecteur
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
