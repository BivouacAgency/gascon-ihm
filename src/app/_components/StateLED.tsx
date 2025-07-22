import { type FC } from "react";
import { cn } from "@/lib/utils";

interface StateLEDProps {
  isPlaying: boolean;
  colorType?: "blueGrey" | "redGreen";
  className?: string;
}

export const StateLED: FC<StateLEDProps> = ({
  isPlaying,
  colorType = "redGreen",
  className,
}) => {
  // Define the colors for the LED based on the color type
  const activeColor = colorType === "blueGrey" ? "bg-blue" : "bg-green";
  const inactiveColor = colorType === "blueGrey" ? "bg-grey" : "bg-red";

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
