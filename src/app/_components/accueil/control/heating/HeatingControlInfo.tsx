import { type FC } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatElapsedTime } from "@/utils/time";
import type { HeatingData } from "./HeatingControlSection";

interface HeatingControlInfoProps {
  data: HeatingData;
}

const HeatingControlInfo: FC<HeatingControlInfoProps> = ({ data }) => {
  return (
    <Table className="mb-2 text-white">
      <TableBody>
        <TableRow>
          <TableCell className="font-bold">Cible </TableCell>
          <TableCell>{data.capteur}</TableCell>
          <TableCell>{data.temperatureSet}°C</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Temps </TableCell>
          <TableCell>{formatElapsedTime(data.elapsedTime)}</TableCell>
          <TableCell>{data.durationSet} min</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">R1+R2 </TableCell>
          <TableCell>{data.isR1PlusR2 ? "oui" : "non"}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default HeatingControlInfo;
