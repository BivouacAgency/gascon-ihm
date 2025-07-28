import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { StateLED } from "@/app/_components/StateLED";
import type { FC } from "react";

export interface SensorData {
  sensorName: string;
  value: string;
  unit: string;
}

export interface SensorsInfoProps {
  className?: string;
  data: SensorData[];
  isRecording: boolean;
  isStale?: boolean;
}

export const SensorsInfo: FC<SensorsInfoProps> = ({
  data,
  isRecording,
  isStale = false,
  className,
}: SensorsInfoProps) => {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-4xl font-semibold text-white mb-4">Capteurs</div>
          {isStale && (
            <span className="ml-2 text-md text-red-400 whitespace-nowrap">⚠️ Pas de données récentes</span>
          )}
        </div>
        <StateLED isPlaying={isRecording} colorType="blueGrey" />
      </div>
      <Table className="text-white">
        <TableHeader>
          <TableRow>
            {data.map((sensor, index) => (
              <TableHead
                key={index}
                className="text-center font-bold text-white"
              >
                {sensor.sensorName}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {data.map((sensor, index) => (
              <TableCell key={index} className="text-center">
                {sensor.value} {sensor.unit}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
