"use client"
import { Button } from "@/app/_components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select"
import { useESP32Communication } from "@/app/_hooks/useESP32Communication"
import { ESP32Command } from "@/server/esp32-serial-protocol/types"
import { useState, type FC } from "react"

export const SelectActuator: FC = () => {
    const { sendCommand } = useESP32Communication();
    const [actuatorId, setActuatorId] = useState<number>(0);
    const actuatorOptions = Array.from({ length: 15 }, (_, index) => ({
        value: index,
        label: `Relais ${index + 1}`,
    }));

    const handleActuatorON = () => {
        sendCommand({
            payload: {
                action: ESP32Command.MAN_ACT,
                data: {
                    command: 1,
                    actuator: actuatorId,
                },
            },
        })
    }

    const handleActuatorOFF = () => {
        sendCommand({
            payload: {
                action: ESP32Command.MAN_ACT,
                data: {
                    command: 0,
                    actuator: actuatorId,
                },
            },
        })
    }

    return (
        <div className="flex items-center gap-2">
            <Select
                value={String(actuatorId)}
                onValueChange={(value) => setActuatorId(Number(value))}
            >
                <SelectTrigger className="h-[4.5rem] min-w-56 text-xl">
                    <SelectValue placeholder="Choisir un relais" />
                </SelectTrigger>
                <SelectContent>
                    {actuatorOptions.map((option) => (
                        <SelectItem key={option.value} value={String(option.value)}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button size="default" className="h-16 bg-grey px-8 text-lg text-white" onClick={handleActuatorON}>
                ON
            </Button>
            <Button size="default" className="h-16 bg-grey px-8 text-lg text-white" onClick={handleActuatorOFF}>
                OFF
            </Button>
        </div>
    )
}