import { type FC } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/app/_components/ui/table";
import { formatElapsedTime } from "@/utils/time";
import type { HeatingData } from "@/types/forms/HeatingData";

interface HeatingControlInfoProps {
  data?: HeatingData;
}

export const HeatingControlInfo: FC<HeatingControlInfoProps> = ({ data }) => {
  return (
    <Table className="mb-2 text-white">
      <TableBody>
        <TableRow>
          <TableCell className="font-bold">Cible </TableCell>
          <TableCell>{data?.capteur ?? "-"}</TableCell>
          <TableCell>{data?.temperatureSet ? `${data.temperatureSet}°C` : "-"}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Temps </TableCell>
          <TableCell>
            {data?.elapsedTime ? formatElapsedTime(data.elapsedTime) : "--:--"}
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
