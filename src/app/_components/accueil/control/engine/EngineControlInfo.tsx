import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { type FC } from "react";
import type { EngineData } from "./EngineControlSection";
import { StartStopButton } from "@/app/_components/StartStopButton";
import { StateLED } from "@/app/_components/StateLED";

interface EngineControlInfoProps {
  className?: string;
  data: EngineData;
}

export const EngineControlInfo: FC<EngineControlInfoProps> = ({ data }) => {
  // Placeholder function for buttons (functionality to be implemented later)
  const handleButtonClick = ({ motorId }: { motorId: number }) => {
    // BACKEND: Implement motor/valve control logic
    console.log("Motor ID:", motorId);
  };

  return (
    <Table className="text-white">
      <TableBody>
        <TableRow>
          <TableCell className="flex items-center gap-2 font-bold">
            <StartStopButton
              isPlaying={data.m1Status}
              onClick={() => handleButtonClick({ motorId: 1 })}
            />
            M1{" "}
          </TableCell>
          <TableCell>
            <div className="flex items-center justify-end">
              <StateLED isPlaying={data.m1Status} />
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="flex items-center gap-2 font-bold">
            <StartStopButton
              isPlaying={data.ev1Status}
              onClick={() => handleButtonClick({ motorId: 2 })}
            />
            EV1{" "}
          </TableCell>
          <TableCell>
            <div className="flex items-center justify-end">
              <StateLED isPlaying={data.ev1Status} />
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="flex items-center gap-2 font-bold">
            <StartStopButton
              isPlaying={data.ev2Status}
              onClick={() => handleButtonClick({ motorId: 3 })}
            />
            EV2{" "}
          </TableCell>
          <TableCell>
            <div className="flex items-center justify-end">
              <StateLED isPlaying={data.ev2Status} />
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="flex items-center gap-2 font-bold">
            <StartStopButton
              isPlaying={data.ev3Status}
              onClick={() => handleButtonClick({ motorId: 4 })}
            />
            EV3{" "}
          </TableCell>
          <TableCell>
            <div className="flex items-center justify-end">
              <StateLED isPlaying={data.ev3Status} />
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
