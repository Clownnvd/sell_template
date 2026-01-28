import { z } from "zod";

/* =========================
 * SIGN IN
 * ========================= */

export const signInSchema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignInInput = z.infer<typeof signInSchema>;

/* =========================
 * SIGN UP
 * ========================= */

export const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Email is invalid"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  })
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
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/* =========================
 * RESET PASSWORD
 * ========================= */

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  })
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
});

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
