"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { FaChevronDown } from "react-icons/fa6";

export interface AppFormSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  options: (string | number | boolean)[];
  unit?: string;
}

export const AppFormSelectField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  options,
  unit = "",
}: AppFormSelectFieldProps<TFieldValues, TName>) => {
  const getLabel = (value: string | number | boolean) => {
    if (typeof value === "boolean") {
      return value ? "Oui" : "Non";
    }
    if (typeof value === "number" && unit) {
      return `${value}${unit}`;
    }
    return value.toString();
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">{label}</FormLabel>
          <FormControl>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="w-full justify-between">
                  {getLabel(field.value)}
                  <FaChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[var(--radix-dropdown-menu-trigger-width)]">
                {options.map((option) => (
                  <DropdownMenuItem
                    key={option.toString()}
                    onClick={() => field.onChange(option)}
                  >
                    {getLabel(option)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
