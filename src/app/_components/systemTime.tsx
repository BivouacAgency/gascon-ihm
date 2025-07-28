"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, type FC } from "react";

interface SystemTimeProps {
  className?: string;
}

export const SystemTime: FC<SystemTimeProps> = ({ className }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  // Effect to set the client state to true and update the current time every second
  useEffect(() => {
    setIsClient(true);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format the time to display in the system time
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  // Format the date to display in the system time
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  // If the client is not loaded, display a loading message
  if (!isClient) {
    return (
      <div className={cn("text-center font-mono text-md", className)}>
        <div className="text-white">--:--:--</div>
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  // If the client is loaded, display the current time and date
  return (
    <div className={cn("text-center font-mono text-xl", className)}>
      <div className="text-white opacity-60">{formatTime(currentTime)}</div>
      <div className="text-white opacity-60">{formatDate(currentTime)}</div>
    </div>
  );
};
