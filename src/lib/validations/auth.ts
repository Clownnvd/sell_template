import { z } from "zod";

export const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

/* =========================
 * SIGN IN
 * ========================= */

export const signInSchema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(1, "Password is required"),
});

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
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
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
