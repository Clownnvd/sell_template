import { z } from "zod";
import { strongPasswordSchema } from "./auth";

export const updateEmailSchema = z.object({
  newEmail: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required"),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const notificationPreferencesSchema = z.object({
  emailNotifications: z.object({
    marketing: z.boolean(),
    updates: z.boolean(),
    invitations: z.boolean(),
    reminders: z.boolean(),
  }),
  pushNotifications: z.object({
    enabled: z.boolean(),
    mentions: z.boolean(),
    messages: z.boolean(),
  }),
});

export type UpdateEmailInput = z.infer<typeof updateEmailSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type NotificationPreferencesInput = z.infer<
  typeof notificationPreferencesSchema
>;
