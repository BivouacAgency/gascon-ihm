import { z } from "zod";

export const ActuatorDataSchema = z.object({
  command: z.number().min(0).max(1),
  actuator: z.number().min(0).max(15),
});

export type ActuatorData = z.infer<typeof ActuatorDataSchema>;