"use client";

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
import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { AgitationDataSchema, type AgitationData } from "@/types/forms/AgitationData";
import { FaScrewdriverWrench } from "react-icons/fa6";
import {
  AGITATOR_DURATION_OPTIONS,
  AGITATOR_SPEED_OPTIONS,
} from "@/config/agitator/config";
import { AppFormSelectField } from "@/app/_components/form-components/AppFormSelectField";

interface AgitationSettingsModalProps {
  data: AgitationData;
  onSave: (newData: AgitationData) => void;
}

const formSchema = AgitationDataSchema.omit({
  elapsedTime: true,
});

export const AgitationSettingsModal: FC<AgitationSettingsModalProps> = ({
  data,
  onSave,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      speedSet: data.speedSet,
      durationSet: data.durationSet,
    },
  });

  const onSubmit = (formData: z.infer<typeof formSchema>) => {
    onSave(formData as AgitationData);
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
          <DialogTitle>Paramètres d&apos;Agitation</DialogTitle>
          <DialogDescription className="text-white">
            Modifiez les paramètres du programme d&apos;agitation.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AppFormSelectField
              control={form.control}
              name="speedSet"
              label="Vitesse (tr/min)"
              options={AGITATOR_SPEED_OPTIONS}
              unit=" tr/min"
            />

            <AppFormSelectField
              control={form.control}
              name="durationSet"
              label="Durée (min)"
              options={AGITATOR_DURATION_OPTIONS}
              unit=" min"
            />

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
