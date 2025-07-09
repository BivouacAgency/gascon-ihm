import Image from "next/image";
import type { FC } from "react";
import AgitationControlSection from "./control/agitation/AgitationControlSection";
import EngineControlSection from "./control/engine/EngineControlSection";
import SensorsSection from "./sensors/SensorsSection";
import HeatingControlSection from "./control/heating/HeatingControlSection";

const HomePageComponent: FC = () => {
  return (
    <div className="bg-grey h-full p-4">
      <div className="flex h-full gap-4">
        <div className="flex min-w-96 flex-col gap-4">
          <div className="bg-dark-grey border-grey rounded-lg border p-4 shadow-lg">
            <div className="flex flex-col gap-4">
              <HeatingControlSection />
              <AgitationControlSection />
              <EngineControlSection />
            </div>
          </div>

          <div className="bg-dark-grey border-grey grow rounded-lg border p-4 shadow-lg">
            <SensorsSection />
          </div>
        </div>

        <div className="flex w-80 min-w-0 flex-grow basis-0 flex-col gap-4">
          <div className="bg-dark-grey border-grey relative flex-grow overflow-hidden rounded-lg border shadow-lg">
            <Image
              src="/image_cuve_gascon_tmp.jpg"
              alt="Cuve"
              width={2432}
              height={1664}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="bg-dark-grey border-grey rounded-lg border p-4 shadow-lg">
            <p className="text-center leading-relaxed text-white">
              Lorem ipsum dolor: sit amet consecteur
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageComponent;
