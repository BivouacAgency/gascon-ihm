import { Time } from "@internationalized/date";
import { z } from "zod";

// This file contains the schema for the agitation data

export const AgitationDataSchema = z.object({
  speedSet: z.number(),
  durationSet: z.custom<Time>((value) => value instanceof Time),
  elapsedTime: z.custom<Time>((value) => value instanceof Time),
});

export type AgitationData = z.infer<typeof AgitationDataSchema>;
