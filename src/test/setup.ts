import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock next/cache — revalidatePath/revalidateTag are server-only and not available in test env
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

// Mock cache-utils — wraps next/cache with logging
vi.mock("@/lib/cache-utils", () => ({
  revalidatePathWithLog: vi.fn(),
  revalidateTagWithLog: vi.fn(),
}));

// Mock env — serverEnv validates at import time, provide test defaults
vi.mock("@/lib/env", () => ({
  serverEnv: {
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
    BETTER_AUTH_SECRET: "test-secret-at-least-16-chars",
    STRIPE_SECRET_KEY: "sk_test_mock",
    STRIPE_WEBHOOK_SECRET: "whsec_test_mock",
    GITHUB_PAT: "ghp_test_mock",
    GITHUB_REPO_OWNER: "test-owner",
    GITHUB_REPO_NAME: "test-repo",
    RESEND_API_KEY: "re_test_mock",
    RESEND_FROM: "test@example.com",
  },
  clientEnv: {
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_mock",
  },
}));

// Mock api/logger — prevent console output in tests
vi.mock("@/lib/api/logger", () => ({
  logRequest: vi.fn(),
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));
