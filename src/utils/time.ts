import { Time } from "@internationalized/date";

/**
 * Format the elapsed time
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
 * Convert the elapsed time to a Time object
 * @param elapsedTime - The elapsed time in milliseconds
 * @returns The Time object
 */
export const elapsedMsToTime = (elapsedTime: number): Time => {
  const totalSeconds = Math.floor(elapsedTime / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return new Time(0, minutes, seconds);
};