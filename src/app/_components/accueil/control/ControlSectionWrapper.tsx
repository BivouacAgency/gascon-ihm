import { type FC, type ReactNode } from "react";
import { StartStopButton } from "../../StartStopButton";
import { StateLED } from "../../StateLED";

// Props for the PlayControl component  
interface PlayControl {
  isPlaying: boolean;
  onPlayToggle: () => void;
}

// Props for the ControlSectionWrapper component
interface ControlSectionWrapperProps {
  title: string;
  infoComponent: ReactNode;
  settingsModal?: ReactNode;
  playControl?: PlayControl;
  className?: string;
}

/**
 * ControlSectionWrapper wraps a control section with:
 * - a title
 * - optional settings modal trigger
 * - optional play/pause controls
 * Renders the provided infoComponent beneath the header.
 */
export const ControlSectionWrapper: FC<ControlSectionWrapperProps> = ({
  title,
  settingsModal,
  infoComponent,
  playControl,
  className,
}) => {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between text-white">
        <h3 className="text-4xl font-semibold mb-2">{title}</h3>
        <div className="flex items-center gap-4">
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
