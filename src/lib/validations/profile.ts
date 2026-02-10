import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  avatarUrl: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
}).strict();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
