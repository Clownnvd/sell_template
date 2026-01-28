import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import prisma from "@/lib/db";
import { sendReactEmailSafe } from "@/lib/email/resend";

import { ResetPasswordTemplate } from "@/lib/email/templates/reset-password";
import { VerifyEmailTemplate } from "@/lib/email/templates/verify-email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,

    sendResetPassword: async ({ user, url }) => {
      sendReactEmailSafe({
        to: user.email,
        subject: "Reset your password",
        react: ResetPasswordTemplate({
          name: user.name ?? undefined,
          url,
        }),
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url }) => {
      sendReactEmailSafe({
        to: user.email,
        subject: "Verify your email",
        react: VerifyEmailTemplate({
          name: user.name ?? undefined,
          url,
        }),
      });
    },
  },
});
