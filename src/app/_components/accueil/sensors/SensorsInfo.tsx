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
          <h3 className="text-lg font-semibold text-white">Capteurs</h3>
          {isStale && (
            <span className="ml-2 text-sm text-red-400">⚠️ No recent data</span>
          )}
        </div>
        <StateLED isPlaying={isRecording} colorType="blueGrey" />
      </div>
      <Table className="text-white">
        <TableHeader>
          <TableRow>
            {data.map((capteur, index) => (
              <TableHead
                key={index}
                className="text-center font-bold text-white"
              >
                {capteur.sensorName}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {data.map((capteur, index) => (
              <TableCell key={index} className="text-center">
                {capteur.value} {capteur.unit}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
