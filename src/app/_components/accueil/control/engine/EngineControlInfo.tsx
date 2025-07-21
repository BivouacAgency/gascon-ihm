import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { type FC } from "react";
import type { EngineData } from "@/types/forms/EngineData";
import { StartStopButton } from "@/app/_components/StartStopButton";
import { StateLED } from "@/app/_components/StateLED";

interface EngineControlInfoProps {
  className?: string;
  data: EngineData;
}

export const EngineControlInfo: FC<EngineControlInfoProps> = ({ data }) => {
  const handleButtonClick = ({ engineId }: { engineId: number }) => {
    // BACKEND: Implement engine/valve control logic
    console.log("Engine ID:", engineId);
  };

  return (
    <Table className="text-white">
      <TableBody>
        <TableRow>
          <TableCell className="flex items-center gap-2 font-bold">
            <StartStopButton
              isPlaying={data.m1Status}
              onClick={() => handleButtonClick({ engineId: 1 })}
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
              onClick={() => handleButtonClick({ engineId: 2 })}
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
              onClick={() => handleButtonClick({ engineId: 3 })}
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
              onClick={() => handleButtonClick({ engineId: 4 })}
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
