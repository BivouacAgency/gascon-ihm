import { type FC } from "react";
import { cn } from "@/lib/utils";

interface StateLEDProps {
  isPlaying: boolean;
  type?: "blueGrey" | "redGreen";
  className?: string;
}

const StateLED: FC<StateLEDProps> = ({
  isPlaying,
  type = "redGreen",
  className,
}) => {
  const activeColor = type === "blueGrey" ? "bg-blue-400" : "bg-green-700";
  const inactiveColor = type === "blueGrey" ? "bg-grey" : "bg-red-700";

  return (
    <div
      className={cn(
        "h-4 w-4 rounded-full",
        isPlaying ? activeColor : inactiveColor,
        className,
      )}
    />
  );
};

export default StateLED;
