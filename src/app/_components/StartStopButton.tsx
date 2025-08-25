import { type FC } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import { Button } from "@/app/_components/ui/button";
import { cn } from "@/lib/utils";

interface StartStopButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  className?: string;
}

export const StartStopButton: FC<StartStopButtonProps> = ({
  isPlaying,
  onClick,
  className,
}) => {
  return (
    <Button size="xl" className={cn("bg-grey", className)} onClick={onClick}>
      {isPlaying ? <FaStop /> : <FaPlay />}
    </Button>
  );
};
