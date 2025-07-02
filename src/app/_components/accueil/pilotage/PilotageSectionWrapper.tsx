import { type FC, type ReactNode } from "react";
import StartStopButton from "../../StartStopButton";
import StateLED from "../../StateLED";

interface PlayControl {
  isPlaying: boolean;
  onPlayToggle: () => void;
}

interface PilotageSectionWrapperProps {
  title: string;
  infoComponent: ReactNode;
  settingsModal?: ReactNode;
  playControl?: PlayControl;
  className?: string;
}

const PilotageSectionWrapper: FC<PilotageSectionWrapperProps> = ({
  title,
  settingsModal,
  infoComponent,
  playControl,
  className,
}) => {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between text-white">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          {settingsModal}
          {playControl && (
            <>
              <StartStopButton
                isPlaying={playControl.isPlaying}
                onClick={playControl.onPlayToggle}
              />
              <StateLED isPlaying={playControl.isPlaying} />
            </>
          )}
        </div>
      </div>
      {infoComponent}
    </div>
  );
};

export default PilotageSectionWrapper;
