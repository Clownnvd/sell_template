import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor } from "better-auth/plugins";

import prisma from "@/lib/db";
import { sendReactEmail } from "@/lib/email/resend";
import { logAuthEvent } from "@/lib/auth/audit-log";

import { ResetPasswordTemplate } from "@/lib/email/templates/reset-password";
import { VerifyEmailTemplate } from "@/lib/email/templates/verify-email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Refresh token daily
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 min cache
    },
  },

  // Cookie security
  advanced: {
    cookiePrefix: "king",
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieSameSite: "lax" as const,
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
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

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      enabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      enabled: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },

  // Plugins
  plugins: [
    twoFactor({
      issuer: "King Template",
    }),
  ],

  // Audit logging for auth events
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
    account: {
      create: {
        after: async (account) => {
          logAuthEvent("oauth_link", account.userId, {
            provider: account.providerId,
          });
        },
      },
    },
  },
});

// Export auth types for use in the app
export type Session = typeof auth.$Infer.Session;
