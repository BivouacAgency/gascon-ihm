import { z } from "zod";

export const AgitationDataSchema = z.object({
  speedSet: z.number(),
  durationSet: z.number(),
  elapsedTime: z.number(),
});

export type AgitationData = z.infer<typeof AgitationDataSchema>;
