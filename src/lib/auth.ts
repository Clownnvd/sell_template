import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import prisma from "@/lib/db";
import { sendReactEmail } from "@/lib/email/resend";
import { logAuthEvent } from "@/lib/auth/audit-log";

import { ResetPasswordTemplate } from "@/lib/email/templates/reset-password";
import { VerifyEmailTemplate } from "@/lib/email/templates/verify-email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: Boolean(process.env.RESEND_API_KEY),

    sendResetPassword: async ({ user, url }) => {
      await sendReactEmail({
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
      await sendReactEmail({
        to: user.email,
        subject: "Verify your email",
        react: VerifyEmailTemplate({
          name: user.name ?? undefined,
          url,
        }),
      });
    },
  },

  // OAuth providers - configured via environment variables
  // Set GOOGLE_CLIENT_ID/SECRET and GITHUB_CLIENT_ID/SECRET to enable
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "disabled",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "disabled",
      enabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "disabled",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "disabled",
      enabled: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    },
  },

  // Account linking - allow users to link multiple OAuth accounts
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },

  // Audit logging for auth events (security observability)
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          logAuthEvent("sign_up", user.id);
        },
      },
    },
    session: {
      create: {
        after: async (session) => {
          logAuthEvent("sign_in", session.userId, {
            ip: session.ipAddress ?? undefined,
          });
        },
      },
    },
  },
});

// Export auth types for use in the app
export type Session = typeof auth.$Infer.Session;
