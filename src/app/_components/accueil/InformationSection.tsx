"use client"

import { useESP32Communication } from '@/hooks/useESP32Communication'
import { ESP32Command } from '@/server/esp32-serial-protocol/types';
import React, { useEffect, useState, type FC } from 'react'

export const InformationSection: FC = () => {
   const  { lastMessage } = useESP32Communication();
   const [heatingInProgress, setHeatingInProgress] = useState(false);

  useEffect(() => {
    if (lastMessage) {
        if (lastMessage.type === ESP32Command.MAN_HEAT_STATUS && !heatingInProgress) {
            setHeatingInProgress(true);
        }
    }
  }, [lastMessage]);

  return (
    <p className="text-center leading-relaxed text-white">
        {heatingInProgress && "Chauffe en cours..."}
    </p>
  )
}
