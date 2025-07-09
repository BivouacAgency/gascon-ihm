"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, type FC } from "react";

interface SystemTimeProps {
  className?: string;
}

export const SystemTime: FC<SystemTimeProps> = ({ className }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (!isClient) {
    return (
      <div className={cn("text-center font-mono text-sm", className)}>
        <div className="text-white">--:--:--</div>
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className={cn("text-center font-mono text-sm", className)}>
      <div className="text-white opacity-60">{formatTime(currentTime)}</div>
      <div className="text-white opacity-60">{formatDate(currentTime)}</div>
    </div>
  );
};
