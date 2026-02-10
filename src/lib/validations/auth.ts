import { z } from "zod";

export const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[0-9]/, "Must contain a number")
  .regex(/[^a-zA-Z0-9]/, "Must contain a special character");

/* =========================
 * SIGN IN
 * ========================= */

export const signInSchema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(1, "Password is required"),
}).strict();

export type SignInInput = z.infer<typeof signInSchema>;

/* =========================
 * SIGN UP
 * ========================= */

export const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Email is invalid"),
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .strict()
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

/* =========================
 * FORGOT PASSWORD
 * ========================= */

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email is invalid"),
}).strict();

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/* =========================
 * RESET PASSWORD
 * ========================= */

export const resetPasswordSchema = z
  .object({
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .strict()
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/* =========================
 * RESEND VERIFICATION EMAIL
 * ========================= */

export const resendVerificationSchema = z.object({
  email: z.string().email("Email is invalid"),
}).strict();

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
