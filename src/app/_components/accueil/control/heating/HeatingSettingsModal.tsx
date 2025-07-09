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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SENSOR_NAMES } from "@/config/sensors/config";
import { FaScrewdriverWrench, FaChevronDown } from "react-icons/fa6";
import type { HeatingData } from "@/types/HeatingData";
import {
  ENGINE_DURATION_OPTIONS,
  ENGINE_TEMPERATURE_OPTIONS,
} from "@/config/engine/config";

interface HeatingSettingsModalProps {
  data: HeatingData;
  onSave: (newData: HeatingData) => void;
}

const formSchema = z.object({
  temperatureSet: z.number().min(60).max(100),
  durationSet: z.number().min(5).max(60),
  isR1PlusR2: z.boolean(),
  capteur: z.enum(SENSOR_NAMES),
});

const temperatureOptions = ENGINE_TEMPERATURE_OPTIONS;
const durationOptions = ENGINE_DURATION_OPTIONS;

const r1PlusR2Options = [
  { label: "Oui", value: true },
  { label: "Non", value: false },
];

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
          <DialogDescription className="text-gray-300">
            Modifiez les paramètres du programme de chauffe.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="capteur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Capteur</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-white/90"
                        >
                          {field.value}
                          <FaChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {SENSOR_NAMES.map((sensor) => (
                          <DropdownMenuItem
                            key={sensor}
                            onClick={() => field.onChange(sensor)}
                          >
                            {sensor}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="temperatureSet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Température (°C)</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-white/90"
                        >
                          {field.value}°C
                          <FaChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {temperatureOptions.map((temp) => (
                          <DropdownMenuItem
                            key={temp}
                            onClick={() => field.onChange(temp)}
                          >
                            {temp}°C
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationSet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Durée (min)</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-white/90"
                        >
                          {field.value} min
                          <FaChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {durationOptions.map((duration) => (
                          <DropdownMenuItem
                            key={duration}
                            onClick={() => field.onChange(duration)}
                          >
                            {duration} min
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isR1PlusR2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">R1+R2</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-white/90"
                        >
                          {field.value ? "Oui" : "Non"}
                          <FaChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {r1PlusR2Options.map((option) => (
                          <DropdownMenuItem
                            key={option.label}
                            onClick={() => field.onChange(option.value)}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="bg-white/90 text-black"
              >
                Annuler
              </Button>
              <Button type="submit" className="bg-white/90 text-black">
                Sauvegarder
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
