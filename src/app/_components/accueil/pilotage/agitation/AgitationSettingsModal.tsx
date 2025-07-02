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
import type { AgitationData } from "./PilotageAgitationSection";
import { FaScrewdriverWrench } from "react-icons/fa6";

interface AgitationSettingsModalProps {
  data: AgitationData;
  onSave: (newData: AgitationData) => void;
}

export const AgitationSettingsModal: FC<AgitationSettingsModalProps> = ({
  data,
  onSave,
}) => {
  const [formData, setFormData] = useState<AgitationData>(data);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onSave(formData);
    setIsOpen(false);
  };

  const handleSpeedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, speedSet: Number(e.target.value) });
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, durationSet: Number(e.target.value) });
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
          <DialogTitle>Paramètres d&apos;Agitation</DialogTitle>
          <DialogDescription>
            Modifiez les paramètres du programme d&apos;agitation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="speed" className="text-right text-sm font-medium">
              Vitesse (tr/min)
            </label>
            <input
              id="speed"
              type="number"
              value={formData.speedSet}
              onChange={handleSpeedChange}
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

export default AgitationSettingsModal;
