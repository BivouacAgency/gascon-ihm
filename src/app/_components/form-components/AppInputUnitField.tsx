import { useId } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

export interface AppInputUnitFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  unit: string;
}

export const AppInputUnitField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  unit,
}: AppInputUnitFieldProps<TFieldValues, TName>) => {
  const id = useId();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel className="text-white">{label}</FormLabel>
            <FormControl>
              <div className="*:not-first:mt-2">
                <div className="bg-grey flex rounded-md text-white shadow-xs">
                  <Input
                    id={id}
                    className="rounded-e-none border-none shadow-none"
                    type="number"
                    {...field}
                    value={field.value}
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        field.onChange("");
                      } else {
                        field.onChange(Number(value));
                      }
                    }}
                    onFocus={(e) => {
                      e.target.select();
                    }}
                  />
                  <span className="bg-grey z-10 inline-flex items-center rounded-e-md border border-none px-6 text-2xl text-white">
                    {unit}
                  </span>
                </div>
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};
