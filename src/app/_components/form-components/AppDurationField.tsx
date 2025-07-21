"use client";

import { DateSegment, TimeField } from "@/app/_components/ui/datefield-rac";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { ClockIcon } from "lucide-react";
import { DateInput } from "react-aria-components";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

export interface AppDurationFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
}

export const AppDurationField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
}: AppDurationFieldProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel className="text-white">{label}</FormLabel>
            <FormControl>
              <TimeField
                className="*:not-first:mt-2"
                {...field}
                value={field.value}
                onChange={field.onChange}
                granularity="second"
                shouldForceLeadingZeros={true}
                hideTimeZone
                hourCycle={undefined}
              >
                <div className="relative">
                  <DateInput className="bg-grey border-input bg-background relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border border-none px-3 py-2 text-sm whitespace-nowrap text-white shadow-xs transition-[color,box-shadow] outline-none [&>:first-child]:hidden [&>:nth-child(2)]:hidden [&>:nth-child(3)]:hidden">
                    {(segment) => (
                      <DateSegment
                        className="rounded-none focus:bg-white/30"
                        segment={segment}
                      />
                    )}
                  </DateInput>
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 z-10 flex items-center justify-center pe-3 text-white">
                    <ClockIcon size={16} aria-hidden="true" />
                  </div>
                </div>
              </TimeField>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
