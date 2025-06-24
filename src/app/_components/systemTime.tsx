"use client";

import { useState, useEffect } from "react";

interface SystemTimeProps {
  className?: string;
}

export function SystemTime({ className = "" }: SystemTimeProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
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

  return (
    <div className={`text-center font-mono text-sm ${className}`}>
      <div className="text-gray-300">{formatTime(currentTime)}</div>
      <div className="text-gray-400">{formatDate(currentTime)}</div>
    </div>
  );
}
