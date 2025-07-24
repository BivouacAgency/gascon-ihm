import { type FC } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/app/_components/ui/table";
import { formatElapsedMsToTime, formatElapsedTime } from "@/utils/time";
import type { HeatingData } from "@/types/forms/HeatingData";

// Props for the HeatingControlInfo component
interface HeatingControlInfoProps {
  data?: HeatingData;
}

/**
 * Displays heating target and status:
 * - sensor: active sensor identifier
 * - temperatureSet: target temperature (°C)
 * - elapsedTime: formatted elapsed time
 * - durationSet: formatted duration
 * - R1R2: selected heater elements
 */
export const HeatingControlInfo: FC<HeatingControlInfoProps> = ({ data }) => {
  return (
    <Table className="mb-2 text-white">
      <TableBody>
        <TableRow>
          <TableCell className="font-bold">Cible </TableCell>
          <TableCell>{data?.sensor ?? "-"}</TableCell>
          <TableCell>{data?.temperatureSet ? `${data.temperatureSet}°C` : "-"}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Temps </TableCell>
          <TableCell>
            {data?.elapsedTime ? formatElapsedMsToTime(data.elapsedTime) : "--:--"}
          </TableCell>
          <TableCell>
            {data?.durationSet
              ? formatElapsedTime(data.durationSet)
              : "--:--"}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">R1/R2 </TableCell>
          <TableCell>{data?.R1R2 ?? "-"}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
