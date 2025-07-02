import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, type ChangeEvent, type FC } from "react";
import type { ChauffeData } from "./PilotageChauffeSection";
import { FaScrewdriverWrench } from "react-icons/fa6";

interface ChauffeSettingsModalProps {
  data: ChauffeData;
  onSave: (newData: ChauffeData) => void;
}

export const ChauffeSettingsModal: FC<ChauffeSettingsModalProps> = ({
  data,
  onSave,
}) => {
  const [formData, setFormData] = useState<ChauffeData>(data);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onSave(formData);
    setIsOpen(false);
  };

  const handleTemperatureChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, temperatureSet: Number(e.target.value) });
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, durationSet: Number(e.target.value) });
  };

  const handleR1PlusR2Change = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, isR1PlusR2: e.target.checked });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-grey text-white">
          <FaScrewdriverWrench />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Paramètres de Chauffe</DialogTitle>
          <DialogDescription>
            Modifiez les paramètres du programme de chauffe.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="temperature"
              className="text-right text-sm font-medium"
            >
              Température (°C)
            </label>
            <input
              id="temperature"
              type="number"
              value={formData.temperatureSet}
              onChange={handleTemperatureChange}
              className="col-span-3 rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="duration"
              className="text-right text-sm font-medium"
            >
              Durée (min)
            </label>
            <input
              id="duration"
              type="number"
              value={formData.durationSet}
              onChange={handleDurationChange}
              className="col-span-3 rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="r1plusr2"
              type="checkbox"
              checked={formData.isR1PlusR2}
              onChange={handleR1PlusR2Change}
              className="rounded border-gray-300"
            />
            <label htmlFor="r1plusr2" className="text-sm font-medium">
              R1+R2
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave}>Sauvegarder</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChauffeSettingsModal;
