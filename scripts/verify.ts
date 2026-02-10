#!/usr/bin/env tsx
/**
 * Setup Verification Script
 *
 * Verifies that all required environment variables, dependencies,
 * and configurations are properly set up.
 *
 * Usage:
 *   pnpm run verify
 *   or
 *   npx tsx scripts/verify.ts
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Colors for terminal output
const c = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
} as const;

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
  optional: boolean;
}

const results: CheckResult[] = [];

function header(text: string) {
  console.log(`\n${c.bright}${c.blue}--- ${text} ---${c.reset}\n`);
}

function pass(name: string, message: string) {
  console.log(`${c.green}[OK]${c.reset} ${name}: ${message}`);
  results.push({ name, passed: true, message, optional: false });
}

function fail(name: string, message: string) {
  console.log(`${c.red}[FAIL]${c.reset} ${name}: ${message}`);
  results.push({ name, passed: false, message, optional: false });
}

function warn(name: string, message: string) {
  console.log(`${c.yellow}[WARN]${c.reset} ${name}: ${message}`);
  results.push({ name, passed: true, message, optional: true });
}

function envExists(key: string): boolean {
  const val = process.env[key];
  return typeof val === "string" && val.trim().length > 0;
}

// ============================================
// 1. Environment Variables
// ============================================

function checkEnvVariables() {
  header("Environment Variables");

  const required: { key: string; desc: string; validate?: (v: string) => string | null }[] = [
    { key: "DATABASE_URL", desc: "PostgreSQL connection string" },
    {
      key: "BETTER_AUTH_SECRET",
      desc: "BetterAuth secret (min 16 chars)",
      validate: (v) => (v.length < 16 ? "Must be at least 16 characters" : null),
    },
    { key: "NEXT_PUBLIC_APP_URL", desc: "Application URL" },
    {
      key: "STRIPE_SECRET_KEY",
      desc: "Stripe secret key",
      validate: (v) => (v.startsWith("sk_") ? null : "Must start with 'sk_'"),
    },
    {
      key: "STRIPE_WEBHOOK_SECRET",
      desc: "Stripe webhook secret",
      validate: (v) => (v.startsWith("whsec_") ? null : "Must start with 'whsec_'"),
    },
    {
      key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      desc: "Stripe publishable key",
      validate: (v) => (v.startsWith("pk_") ? null : "Must start with 'pk_'"),
    },
  ];

  const optional: { key: string; desc: string }[] = [
    { key: "RESEND_API_KEY", desc: "Resend API key (for emails)" },
    { key: "RESEND_FROM", desc: "Email sender address" },
    { key: "GOOGLE_CLIENT_ID", desc: "Google OAuth client ID" },
    { key: "GOOGLE_CLIENT_SECRET", desc: "Google OAuth client secret" },
    { key: "GITHUB_CLIENT_ID", desc: "GitHub OAuth client ID" },
    { key: "GITHUB_CLIENT_SECRET", desc: "GitHub OAuth client secret" },
    { key: "UPSTASH_REDIS_REST_URL", desc: "Upstash Redis URL (rate limiting)" },
    { key: "UPSTASH_REDIS_REST_TOKEN", desc: "Upstash Redis token (rate limiting)" },
    { key: "GITHUB_PAT", desc: "GitHub PAT for repo invite" },
    { key: "GITHUB_REPO_OWNER", desc: "GitHub repo owner" },
    { key: "GITHUB_REPO_NAME", desc: "GitHub repo name" },
  ];

  for (const { key, desc, validate } of required) {
    if (!envExists(key)) {
      fail(key, `Missing (${desc})`);
      continue;
    }
    if (validate) {
      const err = validate(process.env[key]!);
      if (err) {
        fail(key, `Invalid: ${err}`);
        continue;
      }
    }
    pass(key, desc);
  }

  for (const { key, desc } of optional) {
    if (envExists(key)) {
      pass(key, desc);
    } else {
      warn(key, `Not configured (${desc})`);
    }
  }
}

// ============================================
// 2. Database + Prisma Check
// ============================================

async function checkDatabase() {
  header("Database & Prisma");

  if (!envExists("DATABASE_URL")) {
    fail("Database", "DATABASE_URL not configured, skipping");
    return;
  }

  let prisma: PrismaClient | null = null;

  try {
    const adapter = new PrismaNeon({
      connectionString: process.env.DATABASE_URL!,
    });
    prisma = new PrismaClient({ adapter });

    await prisma.$connect();
    pass("Database", "Connected to PostgreSQL");
  } catch (err) {
    fail("Database", `Connection failed: ${err instanceof Error ? err.message : String(err)}`);
    return;
  }

  // Check Prisma models exist
  const models = ["user", "session", "account", "verification", "emailLog", "purchase", "webhookEvent"];
  let missingModels = false;

  for (const model of models) {
    if (!(model in prisma)) {
      fail("Prisma Model", `'${model}' not found. Run: npx prisma generate`);
      missingModels = true;
      break;
    }
  }

  if (!missingModels) {
    pass("Prisma Models", `All ${models.length} models available`);
  }

  // Check tables exist
  try {
    const userCount = await prisma.user.count();
    pass("Database Schema", `User table found (${userCount} users)`);
  } catch {
    warn("Database Schema", "Tables not migrated yet. Run: npx prisma db push");
  }

  await prisma.$disconnect();
}

// ============================================
// 3. Email Service Check
// ============================================

function checkEmailService() {
  header("Email Service (Resend)");

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM;

  if (!apiKey) {
    warn("Resend", "RESEND_API_KEY not configured (email features disabled)");
    return;
  }

  if (apiKey.startsWith("re_")) {
    pass("Resend API Key", "Valid format");
  } else {
    warn("Resend API Key", "Unusual format (expected 're_' prefix)");
  }

  if (fromEmail) {
    pass("Resend From", `Configured: ${fromEmail}`);
  } else {
    warn("Resend From", "RESEND_FROM not set (required when sending emails)");
  }
}

// ============================================
// 4. Stripe Check
// ============================================

function checkStripeConfiguration() {
  header("Stripe Configuration");

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    fail("Stripe", "STRIPE_SECRET_KEY not configured");
    return;
  }

  const mode = secretKey.startsWith("sk_test_") ? "TEST" : secretKey.startsWith("sk_live_") ? "LIVE" : null;
  if (mode) {
    pass("Stripe Mode", mode);
  } else {
    warn("Stripe Mode", "Could not detect test/live mode from key prefix");
  }

  // Check product price ID
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_KING_TEMPLATE;
  if (priceId && priceId.startsWith("price_")) {
    pass("Stripe Price", `King Template price ID configured`);
  } else {
    warn("Stripe Price", "NEXT_PUBLIC_STRIPE_PRICE_KING_TEMPLATE not configured");
  }
}

// ============================================
// 5. Dependencies Check
// ============================================

function checkDependencies() {
  header("Dependencies");

  const criticalDeps = [
    "next",
    "react",
    "@prisma/client",
    "better-auth",
    "stripe",
    "@stripe/stripe-js",
    "zod",
    "next-intl",
    "lucide-react",
    "@upstash/redis",
    "@upstash/ratelimit",
  ];

  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8");
    const pkg = JSON.parse(raw);
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    for (const dep of criticalDeps) {
      if (allDeps[dep]) {
        pass(dep, allDeps[dep]);
      } else {
        fail(dep, "Not installed. Run: pnpm install");
      }
    }
  } catch {
    fail("Dependencies", "Could not read package.json");
  }
}

// ============================================
// 6. File Structure Check
// ============================================

function checkFileStructure() {
  header("Files & Folders");

  const checks: { filePath: string; type: "file" | "dir"; desc: string }[] = [
    { filePath: "src/app/api", type: "dir", desc: "API routes" },
    { filePath: "src/lib/auth.ts", type: "file", desc: "BetterAuth config" },
    { filePath: "src/lib/db/index.ts", type: "file", desc: "Prisma client" },
    { filePath: "src/lib/env.ts", type: "file", desc: "Env validation" },
    { filePath: "src/lib/csrf.ts", type: "file", desc: "CSRF protection" },
    { filePath: "src/lib/rate-limit.ts", type: "file", desc: "Rate limiter" },
    { filePath: "src/middleware.ts", type: "file", desc: "Auth middleware" },
    { filePath: "src/i18n/config.ts", type: "file", desc: "i18n config" },
    { filePath: "src/messages/en.json", type: "file", desc: "English translations" },
    { filePath: "src/messages/vi.json", type: "file", desc: "Vietnamese translations" },
    { filePath: "prisma/schema.prisma", type: "file", desc: "Database schema" },
    { filePath: ".env", type: "file", desc: "Environment variables" },
  ];

  for (const { filePath, type, desc } of checks) {
    const fullPath = path.join(process.cwd(), filePath);

    try {
      const stats = fs.statSync(fullPath);
      const isMatch = type === "file" ? stats.isFile() : stats.isDirectory();

      if (isMatch) {
        pass(filePath, desc);
      } else {
        fail(filePath, `Expected ${type} but found ${stats.isFile() ? "file" : "directory"}`);
      }
    } catch {
      fail(filePath, `Not found (${desc})`);
    }
  }
}

// ============================================
// Main
// ============================================

async function main() {
  console.log(`\n${c.bright}${c.cyan}King Template - Setup Verification${c.reset}\n`);

  checkEnvVariables();
  await checkDatabase();
  checkEmailService();
  checkStripeConfiguration();
  checkDependencies();
  checkFileStructure();

  // Summary
  header("Summary");

  const required = results.filter((r) => !r.optional);
  const optional = results.filter((r) => r.optional);

  const requiredPassed = required.filter((r) => r.passed).length;
  const requiredFailed = required.filter((r) => !r.passed).length;
  const optionalConfigured = optional.filter((r) => !r.message.startsWith("Not configured")).length;
  const optionalSkipped = optional.length - optionalConfigured;

  console.log(
    `Required: ${c.green}${requiredPassed} passed${c.reset}, ${c.red}${requiredFailed} failed${c.reset}`
  );
  console.log(
    `Optional: ${c.green}${optionalConfigured} configured${c.reset}, ${c.yellow}${optionalSkipped} skipped${c.reset}`
  );
  console.log(`Total: ${results.length} checks\n`);

  if (requiredFailed === 0) {
    console.log(`${c.bright}${c.green}All required checks passed.${c.reset}`);

    if (optionalSkipped > 0) {
      console.log(`${c.yellow}Some optional features not configured (see warnings above).${c.reset}`);
    }

    console.log(`\n${c.bright}Next steps:${c.reset}`);
    console.log(`  1. ${c.cyan}npx prisma db push${c.reset}    (migrate database)`);
    console.log(`  2. ${c.cyan}pnpm run dev${c.reset}           (start dev server)\n`);
    process.exit(0);
  } else {
    console.log(`${c.bright}${c.red}${requiredFailed} required check(s) failed.${c.reset}`);
    console.log(`\n${c.bright}Quick fixes:${c.reset}`);
    console.log(`  - Missing env vars: copy .env.example to .env and fill in values`);
    console.log(`  - Database: check DATABASE_URL and run ${c.cyan}npx prisma db push${c.reset}`);
    console.log(`  - Prisma: run ${c.cyan}npx prisma generate${c.reset}`);
    console.log(`  - Deps: run ${c.cyan}pnpm install${c.reset}\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`${c.red}Verification failed:${c.reset}`, err);
  process.exit(1);
});
