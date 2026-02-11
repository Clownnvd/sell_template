import { Resend } from "resend";
import prisma from "@/lib/db";
import { serverEnv } from "@/lib/env";
import { WelcomeEmail } from "./templates/email-template";
import { VerifyEmailTemplate } from "./templates/verify-email";
import { ResetPasswordTemplate } from "./templates/reset-password";

const resend = new Resend(serverEnv.RESEND_API_KEY);
const FROM_EMAIL = serverEnv.RESEND_FROM || "noreply@example.com";

type EmailResult = {
  success: boolean;
  messageId?: string;
  error?: string;
};

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<EmailResult> {
  const logId = await createEmailLog(to, "Welcome!", "welcome");

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Welcome!",
      react: WelcomeEmail({ firstName: name }),
    });

    if (error) {
      await updateEmailLog(logId, "FAILED", undefined, error.message);
      return { success: false, error: error.message };
    }

    await updateEmailLog(logId, "SENT", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    await updateEmailLog(logId, "FAILED", undefined, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send email verification link
 */
export async function sendVerificationEmail(
  to: string,
  name: string,
  verificationUrl: string
): Promise<EmailResult> {
  const logId = await createEmailLog(to, "Verify your email", "verification");

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Verify your email",
      react: VerifyEmailTemplate({ name, url: verificationUrl }),
    });

    if (error) {
      await updateEmailLog(logId, "FAILED", undefined, error.message);
      return { success: false, error: error.message };
    }

    await updateEmailLog(logId, "SENT", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    await updateEmailLog(logId, "FAILED", undefined, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
): Promise<EmailResult> {
  const logId = await createEmailLog(to, "Reset your password", "password-reset");

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Reset your password",
      react: ResetPasswordTemplate({ name, url: resetUrl }),
    });

    if (error) {
      await updateEmailLog(logId, "FAILED", undefined, error.message);
      return { success: false, error: error.message };
    }

    await updateEmailLog(logId, "SENT", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    await updateEmailLog(logId, "FAILED", undefined, errorMessage);
    return { success: false, error: errorMessage };
  }
}

// Helper functions

async function createEmailLog(
  to: string,
  subject: string,
  template: string
): Promise<string> {
  const log = await prisma.emailLog.create({
    data: {
      to,
      subject,
      template,
      status: "PENDING",
    },
  });
  return log.id;
}

async function updateEmailLog(
  id: string,
  status: "SENT" | "FAILED" | "BOUNCED",
  resendId?: string,
  error?: string
): Promise<void> {
  await prisma.emailLog.update({
    where: { id },
    data: {
      status,
      resendId,
      error,
    },
  });
}
