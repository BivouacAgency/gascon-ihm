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
import type { AgitationData } from "./PilotageAgitationSection";
import { FaScrewdriverWrench, FaChevronDown } from "react-icons/fa6";

interface AgitationSettingsModalProps {
  data: AgitationData;
  onSave: (newData: AgitationData) => void;
}

const formSchema = z.object({
  speedSet: z.number().min(10).max(100),
  durationSet: z.number().min(5).max(60),
});

const speedOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const durationOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

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
          <DialogDescription className="text-gray-300">
            Modifiez les paramètres du programme d&apos;agitation.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="speedSet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Vitesse (tr/min)</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-white/90"
                        >
                          {field.value} tr/min
                          <FaChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {speedOptions.map((speed) => (
                          <DropdownMenuItem
                            key={speed}
                            onClick={() => field.onChange(speed)}
                          >
                            {speed} tr/min
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

export default AgitationSettingsModal;
