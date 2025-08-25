"use client";

import { AppDurationField } from "@/app/_components/form-components/AppDurationField";
import { AppFormSelectField } from "@/app/_components/form-components/AppFormSelectField";
import { AppInputUnitField } from "@/app/_components/form-components/AppInputUnitField";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Form } from "@/app/_components/ui/form";
import { SENSORS } from "@/config/form-settings/sensors/config";
import {
  HeatingDataSchema,
  R1R2Options,
  type HeatingSettings
} from "@/types/forms/HeatingData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { FaScrewdriverWrench } from "react-icons/fa6";
import type { z } from "zod";

// Props for the HeatingSettingsModal component
interface HeatingSettingsModalProps {
  data: HeatingSettings;
  onSave: (newData: HeatingSettings) => void;
}

// Form schema for the HeatingSettingsModal component
const formSchema = HeatingDataSchema.omit({
  elapsedTime: true,
  currentTemperature: true,
});

/**
 * HeatingSettingsModal provides a dialog to configure heating settings:
 * - sensor and temperature selection
 * - duration and R1/R2 element selection
 * Calls onSave with updated settings on submit.
 */
export const HeatingSettingsModal: FC<HeatingSettingsModalProps> = ({
  data,
  onSave,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Form for the modal with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      temperatureSet: data.temperatureSet,
      durationSet: data.durationSet,
      R1R2: R1R2Options[0],
      sensor: data.sensor,
    },
  });

  // Callback to save the form data
  const onSubmit = (formData: z.infer<typeof formSchema>) => {
    const completeData: HeatingSettings = {
      ...formData,
    };
    onSave(completeData);
    setIsOpen(false);
  };

  // Callback to handle form validation errors
  const onError = (errors: unknown) => {
    console.log("Form validation errors:", errors);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="xl" className="bg-grey text-white" >
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
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-4"
          >
            {/* First row - Capteur and Température */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AppFormSelectField
                control={form.control}
                name="sensor"
                label="Capteur"
                options={[...SENSORS]}
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
                name="R1R2"
                label="R1/R2"
                options={[...R1R2Options]}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="default"
                onClick={() => setIsOpen(false)}
                size="xl"
              >
                Annuler
              </Button>
              <Button type="submit" variant="default" size="xl">
                Sauvegarder
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
