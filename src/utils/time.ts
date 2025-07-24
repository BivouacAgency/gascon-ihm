import { Time } from "@internationalized/date";

/**
 * Format the elapsed time for display
 * @param time - The time to format
 * @returns The formatted time
 */
export const formatElapsedTime = (time: Time): string => {
  if (isNaN(time.second) || !isFinite(time.second) || time.second < 0) {
    return "--:--";
  }

  return `${time.minute.toString().padStart(2, "0")}:${time.second.toString().padStart(2, "0")}`;
};

/**
 * Format the elapsed time in milliseconds to a string for display
 * @param elapsedTime - The elapsed time in milliseconds
 * @returns The formatted time
 */
export const formatElapsedMsToTime = (elapsedTime: number): string => {
  const totalSeconds = Math.floor(elapsedTime / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return formatElapsedTime(new Time(0, minutes, seconds));
};