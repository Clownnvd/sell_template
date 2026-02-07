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
    RESEND_API_KEY?: string;
    RESEND_FROM_EMAIL?: string;

    // Payment (Stripe)
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    NEXT_PUBLIC_STRIPE_PRICE_KING_TEMPLATE: string;

    // GitHub integration
    GITHUB_PAT?: string;
    GITHUB_REPO_OWNER?: string;
    GITHUB_REPO_NAME?: string;
    NEXT_PUBLIC_GITHUB_REPO_OWNER?: string;
    NEXT_PUBLIC_GITHUB_REPO_NAME?: string;

    // App
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_APP_NAME?: string;
    NODE_ENV: "development" | "production" | "test";
  }
}
