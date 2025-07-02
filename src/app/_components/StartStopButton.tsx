import { type FC } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface StartStopButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  className?: string;
}

const StartStopButton: FC<StartStopButtonProps> = ({
  isPlaying,
  onClick,
  className,
}) => {
  return (
    <Button className={`bg-grey ${className ?? ""}`} onClick={onClick}>
      {isPlaying ? <FaStop /> : <FaPlay />}
    </Button>
  );
};

export default StartStopButton;
