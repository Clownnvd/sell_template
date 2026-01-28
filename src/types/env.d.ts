declare namespace NodeJS {
  interface ProcessEnv {
    // Database
    DATABASE_URL: string;

    // Auth
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL?: string;

    // OAuth (optional)
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;

    // Email (Resend)
    RESEND_API_KEY: string;
    RESEND_FROM: string;

    // Payment (Stripe)
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;

    // Stripe Price IDs
    NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY?: string;
    NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY?: string;
    NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY?: string;
    NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY?: string;

    // App
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_APP_NAME?: string;
    NODE_ENV: "development" | "production" | "test";
  }
}
