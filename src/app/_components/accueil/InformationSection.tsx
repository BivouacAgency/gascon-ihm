"use client"

import { useESP32Communication } from '@/hooks/useESP32Communication'
import { ESP32Command } from '@/server/esp32-serial-protocol/types';
import React, { useEffect, useState, type FC } from 'react'

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
        if (lastMessage.type === ESP32Command.MAN_HEAT_STATUS && !heatingInProgress) {
            setHeatingInProgress(lastMessage.active === 1);
        }
    }
  }, [lastMessage, heatingInProgress]);

  return (
    <p className="text-center leading-relaxed text-white">
        {heatingInProgress && "Chauffe en cours..."}
    </p>
  )
}
