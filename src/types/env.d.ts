declare namespace NodeJS {
  interface ProcessEnv {
    // Database
    DATABASE_URL: string;
    DIRECT_URL?: string;

    // Auth
    BETTER_AUTH_SECRET: string;

    // OAuth (optional)
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;

    // Payment (Stripe)
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;

    // GitHub integration (optional)
    GITHUB_PAT?: string;
    GITHUB_REPO_OWNER?: string;
    GITHUB_REPO_NAME?: string;

    // Email (Resend — optional)
    RESEND_API_KEY?: string;
    RESEND_FROM?: string;

    // SePay (optional — Vietnamese payment gateway)
    SEPAY_API_KEY?: string;
    SEPAY_BANK_ACCOUNT?: string;
    SEPAY_BANK_CODE?: string;
    SEPAY_WEBHOOK_KEY?: string;

    // Rate limiting (Upstash Redis — optional)
    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;

    // App
    NEXT_PUBLIC_APP_URL: string;
    NODE_ENV: "development" | "production" | "test";
  }
}
