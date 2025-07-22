// This file contains the available options for the heaters form settings

export const R1R2_OPTIONS = ["R1", "R1+R2"] as const;

export type R1R2Option = (typeof R1R2_OPTIONS)[number]; 