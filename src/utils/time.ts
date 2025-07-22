import { Time } from "@internationalized/date";

export const formatElapsedTime = (time: Time): string => {
  if (isNaN(time.second) || !isFinite(time.second) || time.second < 0) {
    return "--:--";
  }

  return `${time.minute.toString().padStart(2, "0")}:${time.second.toString().padStart(2, "0")}`;
};

export const elapsedMsToTime = (elapsedTime: number): Time => {
  const totalSeconds = Math.floor(elapsedTime / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return new Time(0, minutes, seconds);
};