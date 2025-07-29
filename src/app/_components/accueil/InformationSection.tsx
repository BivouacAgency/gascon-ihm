"use client"

import { useESP32Communication } from '@/app/_hooks/useESP32Communication'
import { ESP32Command } from '@/server/esp32-serial-protocol/types';
import React, { useEffect, useMemo, useState, type FC } from 'react'

/**
 * Displays information about the current state of the system:
 * - "Chauffe en cours..." if heating is in progress
 */
export const InformationSection: FC = () => {
  // Hook to send/receive commands from/to the ESP32
  const  { lastMessage } = useESP32Communication();
    
  // State for the heating in progress
  const [heatingInProgress, setHeatingInProgress] = useState(false);

  // Effect to update the heating in progress when the last message is received
  useEffect(() => {
    if (lastMessage) {
        if (lastMessage.type === ESP32Command.MAN_HEAT_STATUS && !heatingInProgress && lastMessage.active === 1) {
            setHeatingInProgress(true);
        }
        if (lastMessage.type === ESP32Command.MAN_HEAT_STATUS && heatingInProgress && lastMessage.active === 0) {
            setHeatingInProgress(false);
        }
    }
  }, [lastMessage, heatingInProgress]);

  const messageToDisplay = useMemo(() => {
    if (heatingInProgress) {
      return "Chauffe en cours...";
    }
    return "Turbocuve 3000";
  }, [heatingInProgress]);


  return (
    <div className="flex flex-col items-center justify-center h-full">
      <p className="text-center leading-relaxed text-white text-2xl">
        {messageToDisplay}
      </p>
    </div>
  )
}
