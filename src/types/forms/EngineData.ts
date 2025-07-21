import { z } from "zod";

export const EngineDataSchema = z.object({
  m1Status: z.boolean(),
  ev1Status: z.boolean(),
  ev2Status: z.boolean(),
  ev3Status: z.boolean(),
});

export type EngineData = z.infer<typeof EngineDataSchema>;
