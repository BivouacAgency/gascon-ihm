import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { type FC } from "react";
import type { ChauffeData } from "./PilotageChauffeSection";
import { formatElapsedTime } from "@/utils/time";

interface PilotageChauffeInfoProps {
  className?: string;
  data: ChauffeData;
}

const PilotageChauffeInfo: FC<PilotageChauffeInfoProps> = ({ data }) => {
  return (
    <Table className="mb-2 text-white">
      <TableBody>
        <TableRow>
          <TableCell className="font-bold">Cible </TableCell>
          <TableCell>TT-R1</TableCell>
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

export default PilotageChauffeInfo;
