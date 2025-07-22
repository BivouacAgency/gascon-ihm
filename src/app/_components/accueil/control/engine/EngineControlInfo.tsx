import { Table, TableBody, TableCell, TableRow } from "@/app/_components/ui/table";
import { type FC } from "react";
import type { EngineData } from "@/types/forms/EngineData";
import { StartStopButton } from "@/app/_components/StartStopButton";
import { StateLED } from "@/app/_components/StateLED";

// Props for the EngineControlInfo component
interface EngineControlInfoProps {
  className?: string;
  data: EngineData;
}

/**
 * Renders Start/Stop buttons and status LEDs for engines and valves:
 * - data.m1Status, ev1Status, ev2Status, ev3Status
 * Clicking buttons logs the engine or valve ID (to be wired to backend).
 */
export const EngineControlInfo: FC<EngineControlInfoProps> = ({ data }) => {
  const handleButtonClick = ({ engineId }: { engineId: number }) => {
    // BACKEND TODO: Implement engine/valve control logic
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
