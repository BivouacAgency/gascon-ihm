import Image from "next/image";
import type { FC } from "react";
import PilotageSection from "./pilotage/PilotageSection";

const HomePageComponent: FC = () => {
  return (
    <div className="bg-grey h-full p-6">
      <div className="flex h-full gap-6">
        <div className="flex min-w-96 flex-col gap-6">
          <div className="bg-dark-grey border-grey rounded-lg border p-6 shadow-lg">
            <PilotageSection />
          </div>

          <div className="bg-dark-grey border-grey rounded-lg border p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-white">Capteurs</h3>
          </div>

          <div className="border-grey flex-grow rounded-lg border bg-white p-6 shadow-lg"></div>
        </div>

        <div className="flex w-80 min-w-0 flex-grow basis-0 flex-col gap-6">
          <div className="bg-dark-grey border-grey relative flex-grow overflow-hidden rounded-lg border shadow-lg">
            <Image
              src="/cuve_tmp.png"
              alt="Cuve"
              fill
              className="object-cover"
            />
          </div>

          <div className="bg-dark-grey border-grey rounded-lg border p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Information
            </h3>
            <p className="leading-relaxed text-white">Lorem ipsum dolor.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageComponent;
