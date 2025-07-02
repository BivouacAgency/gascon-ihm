import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type FC } from "react";
import StateLED from "@/app/_components/StateLED";

export interface CapteurData {
  sensorName: string;
  value: string;
  unit: string;
}

interface CapteursInfoProps {
  className?: string;
  data: CapteurData[];
  isRecording: boolean;
}

const CapteursInfo: FC<CapteursInfoProps> = ({
  data,
  isRecording,
  className,
}) => {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Capteurs</h3>
        <StateLED isPlaying={isRecording} type="blueGrey" />
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

export default CapteursInfo;
