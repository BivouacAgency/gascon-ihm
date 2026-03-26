"use client"
import { Button } from "@/app/_components/ui/button"
import { useESP32Communication } from "@/app/_hooks/useESP32Communication"
import { ESP32Command } from "@/server/esp32-serial-protocol/types"
import type { FC } from "react"
import { FaTemperatureHigh, FaTemperatureLow } from "react-icons/fa"

export const TempCmd: FC = () => {
    const { sendCommand } = useESP32Communication();

    const handleTemperatureHigh = () => {
        sendCommand({
            payload: {
                action: ESP32Command.MAN_ACT,
                data: {
                    command: 1,
                },
            },
        })
    }

    const handleTemperatureLow = () => {
        sendCommand({
            payload: {
                action: ESP32Command.MAN_ACT,
                data: {
                    command: 0,
                },
            },
        })
    }

    return (
        <div>
            <Button size="xl" className="bg-grey text-white" onClick={handleTemperatureHigh}>
                <FaTemperatureHigh /> Activer relais R1
            </Button>
            <Button size="xl" className="bg-grey text-white" onClick={handleTemperatureLow}>
                <FaTemperatureLow /> Desactiver relais R1
            </Button>
        </div>
    )
}