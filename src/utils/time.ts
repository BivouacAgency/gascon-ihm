import type { Time } from "@internationalized/date";

export const formatElapsedTime = (time: Time): string => {
  if (isNaN(time.second) || !isFinite(time.second) || time.second < 0) {
    return "--:--";
  }

  return `${time.minute.toString().padStart(2, "0")}:${time.second.toString().padStart(2, "0")}`;
};
