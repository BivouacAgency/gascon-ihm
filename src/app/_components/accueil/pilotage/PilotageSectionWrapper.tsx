import { type FC, type ReactNode } from "react";
import StartStopButton from "../../StartStopButton";
import StateLED from "../../StateLED";

interface PilotageSectionWrapperProps {
  title: string;
  settingsModal: ReactNode;
  infoComponent: ReactNode;
  isPlaying: boolean;
  onPlayToggle: () => void;
  className?: string;
}

const PilotageSectionWrapper: FC<PilotageSectionWrapperProps> = ({
  title,
  settingsModal,
  infoComponent,
  isPlaying,
  onPlayToggle,
  className,
}) => {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex items-center gap-2">
          {settingsModal}
          <StartStopButton isPlaying={isPlaying} onClick={onPlayToggle} />
          <StateLED isPlaying={isPlaying} />
        </div>
      </div>
      {infoComponent}
    </div>
  );
};

export default PilotageSectionWrapper;
