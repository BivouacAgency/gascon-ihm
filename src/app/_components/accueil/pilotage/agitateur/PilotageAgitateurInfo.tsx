import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { type FC } from "react";
import type { AgitateurData } from "./PilotageAgitateurSection";
import { formatElapsedTime } from "@/utils/time";

interface PilotageAgitateurInfoProps {
  className?: string;
  data: AgitateurData;
}

const PilotageAgitateurInfo: FC<PilotageAgitateurInfoProps> = ({ data }) => {
  return (
    <Table className="mb-2 text-white">
      <TableBody>
        <TableRow>
          <TableCell className="font-bold">AG1 </TableCell>
          <TableCell>{data.speedSet}°C</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Temps </TableCell>
          <TableCell>{formatElapsedTime(data.elapsedTime)}</TableCell>
          <TableCell>{data.durationSet} min</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default PilotageAgitateurInfo;
