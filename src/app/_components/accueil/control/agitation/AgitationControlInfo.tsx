import { Table, TableBody, TableCell, TableRow } from "@/app/_components/ui/table";
import { type FC } from "react";
import type { AgitationData } from "@/types/forms/AgitationData";
import { formatElapsedTime } from "@/utils/time";

// Props for the AgitationControlInfo component
interface AgitationControlInfoProps {
  className?: string;
  data: AgitationData;
}

/**
 * Displays the current agitation control settings and status:
 * - speedSet: target agitation speed in RPM
 * - elapsedTime: formatted elapsed time
 * - durationSet: target agitation duration in minutes
 */
export const AgitationControlInfo: FC<AgitationControlInfoProps> = ({
  data,
}) => {
  return (
    <Table className="mb-2 text-white">
      <TableBody> 
        <TableRow>
          <TableCell className="font-bold">AG1 </TableCell>
          <TableCell>{data.speedSet} tr/min</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Temps </TableCell>
          <TableCell>{data.elapsedTime ? formatElapsedTime(data.elapsedTime) : "--:--"}</TableCell>
          <TableCell>{data.durationSet ? data.durationSet.minute : "--:--"} min</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
