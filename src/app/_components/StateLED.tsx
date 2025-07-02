import { type FC } from "react";
import { cn } from "@/lib/utils";

interface StateLEDProps {
  isPlaying: boolean;
  className?: string;
}

const StateLED: FC<StateLEDProps> = ({ isPlaying, className }) => {
  return (
    <div
      className={cn(
        "h-4 w-4 rounded-full",
        isPlaying ? "bg-green-700" : "bg-red-700",
        className,
      )}
    />
  );
};

export default StateLED;
