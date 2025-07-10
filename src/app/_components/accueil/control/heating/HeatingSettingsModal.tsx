"use client";

import { AppFormSelectField } from "@/app/_components/form-components/AppFormSelectField";
import { AppDurationField } from "@/app/_components/form-components/AppDurationField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ENGINE_TEMPERATURE_OPTIONS } from "@/config/engine/config";
import { SENSOR_NAMES } from "@/config/sensors/config";
import type { HeatingData } from "@/types/HeatingData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { z } from "zod";
import { Time } from "@internationalized/date";
import { AppInputUnitField } from "@/app/_components/form-components/AppInputUnitField";

interface HeatingSettingsModalProps {
  data: HeatingData;
  onSave: (newData: HeatingData) => void;
}

const formSchema = z.object({
  temperatureSet: z.number().min(60).max(100),
  durationSet: z.custom<Time>((value) => value instanceof Time),
  isR1PlusR2: z.boolean(),
  capteur: z.enum(SENSOR_NAMES),
});

// Boolean options as booleans for the simplified component
const r1PlusR2Options = [true, false];

export const HeatingSettingsModal: FC<HeatingSettingsModalProps> = ({
  data,
  onSave,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      temperatureSet: data.temperatureSet,
      durationSet: data.durationSet,
      isR1PlusR2: data.isR1PlusR2,
      capteur: data.capteur,
    },
  });

  const onSubmit = (formData: z.infer<typeof formSchema>) => {
    // Merge form data with other properties from original data
    const completeData: HeatingData = {
      ...data,
      ...formData,
    };
    onSave(completeData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-grey text-white">
          <FaScrewdriverWrench />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-dark-grey">
        <DialogHeader className="text-white">
          <DialogTitle>Paramètres de Chauffe</DialogTitle>
          <DialogDescription className="text-white">
            Modifiez les paramètres du programme de chauffe.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* First row - Capteur and Température */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AppFormSelectField
                control={form.control}
                name="capteur"
                label="Capteur"
                options={[...SENSOR_NAMES]}
              />

              <AppInputUnitField
                control={form.control}
                name="temperatureSet"
                label="Température"
                unit="°C"
              />
            </div>

            {/* Second row - Durée and R1+R2 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AppDurationField
                control={form.control}
                name="durationSet"
                label="Durée"
              />

              <AppFormSelectField
                control={form.control}
                name="isR1PlusR2"
                label="R1+R2"
                options={r1PlusR2Options}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="default"
                onClick={() => setIsOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" variant="default">
                Sauvegarder
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
