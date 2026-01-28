#!/usr/bin/env tsx
/**
 * Setup Verification Script
 *
 * Verifies that all required environment variables, dependencies,
 * and configurations are properly set up.
 *
 * Usage:
 *   npm run verify
 *   or
 *   npx tsx scripts/verify.ts
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Resend } from "resend";
import Stripe from "stripe";

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const { green, red, yellow, blue, cyan, bright, reset } = colors;

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
  optional?: boolean;
}

const results: CheckResult[] = [];

function header(text: string) {
  console.log(`\n${bright}${blue}━━━ ${text} ━━━${reset}\n`);
}

function success(name: string, message: string) {
  console.log(`${green}✓${reset} ${name}: ${message}`);
  results.push({ name, passed: true, message });
}

function error(name: string, message: string, optional = false) {
  console.log(`${red}✗${reset} ${name}: ${message}`);
  results.push({ name, passed: false, message, optional });
}

function warning(name: string, message: string) {
  console.log(`${yellow}⚠${reset} ${name}: ${message}`);
  results.push({ name, passed: true, message, optional: true });
}

function info(text: string) {
  console.log(`${cyan}ℹ${reset} ${text}`);
}

// ============================================
// 1. Environment Variables Check
// ============================================

function checkEnvVariables() {
  header("Environment Variables");

  const required = [
    { key: "DATABASE_URL", description: "Neon PostgreSQL connection string" },
    { key: "BETTER_AUTH_SECRET", description: "BetterAuth secret key" },
    { key: "RESEND_API_KEY", description: "Resend API key for emails" },
    { key: "RESEND_FROM", description: "Email sender address" },
    { key: "NEXT_PUBLIC_APP_URL", description: "Application URL" },
  ];

  const optional = [
    { key: "STRIPE_SECRET_KEY", description: "Stripe secret key (required for billing)" },
    { key: "STRIPE_WEBHOOK_SECRET", description: "Stripe webhook secret" },
    { key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", description: "Stripe publishable key" },
    { key: "STRIPE_PRICE_ID_BASIC_MONTHLY", description: "Stripe price ID for Basic monthly plan" },
    { key: "STRIPE_PRICE_ID_BASIC_YEARLY", description: "Stripe price ID for Basic yearly plan" },
    { key: "STRIPE_PRICE_ID_PRO_MONTHLY", description: "Stripe price ID for Pro monthly plan" },
    { key: "STRIPE_PRICE_ID_PRO_YEARLY", description: "Stripe price ID for Pro yearly plan" },
    { key: "STRIPE_PRICE_ID_ENTERPRISE_MONTHLY", description: "Stripe price ID for Enterprise monthly plan" },
    { key: "STRIPE_PRICE_ID_ENTERPRISE_YEARLY", description: "Stripe price ID for Enterprise yearly plan" },
  ];

  // Check required variables
  for (const { key, description } of required) {
    const value = process.env[key];
    if (!value || value.trim() === "") {
      error(key, `Missing required environment variable (${description})`);
    } else {
      success(key, `Found (${description})`);
    }
  }

  // Check optional variables
  for (const { key, description } of optional) {
    const value = process.env[key];
    if (!value || value.trim() === "") {
      warning(key, `Optional: Not configured (${description})`);
    } else {
      success(key, `Found (${description})`);
    }
  }
}

// ============================================
// 2. Database Connection Check
// ============================================

async function checkDatabaseConnection() {
  header("Database Connection");

  try {
    if (!process.env.DATABASE_URL) {
      error("Database", "DATABASE_URL not configured");
      return;
    }

    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    const prisma = new PrismaClient({ adapter });

    // Try to connect
    await prisma.$connect();
    success("Database", "Successfully connected to PostgreSQL");

    // Check if tables exist
    try {
      const userCount = await prisma.user.count();
      success("Database Schema", `Found User table (${userCount} users)`);
    } catch (err) {
      warning("Database Schema", "Tables may not be migrated yet. Run: npx prisma migrate dev");
    }

    await prisma.$disconnect();
  } catch (err) {
    error("Database", `Failed to connect: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ============================================
// 3. Prisma Client Check
// ============================================

async function checkPrismaClient() {
  header("Prisma Client");

  try {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL || "",
    });

    const prisma = new PrismaClient({ adapter });

    // Check if models are available
    const models = [
      "user",
      "session",
      "account",
      "verification",
      "emailLog",
      "subscription",
    ];

    let allModelsExist = true;
    for (const model of models) {
      if (!(model in prisma)) {
        error("Prisma Model", `Model '${model}' not found. Run: npx prisma generate`);
        allModelsExist = false;
        break;
      }
    }

    if (allModelsExist) {
      success("Prisma Client", `All ${models.length} models are available`);
    }
  } catch (err) {
    error("Prisma Client", `Error: ${err instanceof Error ? err.message : String(err)}`);
    info("Try running: npx prisma generate");
  }
}

// ============================================
// 4. Email Service Check
// ============================================

async function checkEmailService() {
  header("Email Service (Resend)");

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM;

  if (!apiKey) {
    error("Resend API Key", "RESEND_API_KEY not configured");
    return;
  }

  if (!fromEmail) {
    error("Resend From Email", "RESEND_FROM not configured");
    return;
  }

  try {
    const resend = new Resend(apiKey);

    // Validate API key format
    if (apiKey.startsWith("re_")) {
      success("Resend API Key", "Valid API key format");
    } else {
      warning("Resend API Key", "API key format looks unusual (should start with 're_')");
    }

    success("Resend From Email", `Configured as: ${fromEmail}`);
    info("Note: Test email sending by running your app and triggering an email");
  } catch (err) {
    error("Resend", `Error: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ============================================
// 5. Stripe Configuration Check
// ============================================

async function checkStripeConfiguration() {
  header("Stripe Configuration");

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!secretKey || secretKey.trim() === "") {
    warning("Stripe Secret Key", "Not configured (optional for billing features)");
    return;
  }

  try {
    const stripe = new Stripe(secretKey, {
      apiVersion: "2025-12-15.clover",
    });

    // Validate key format
    if (secretKey.startsWith("sk_test_") || secretKey.startsWith("sk_live_")) {
      const mode = secretKey.startsWith("sk_test_") ? "TEST" : "LIVE";
      success("Stripe Secret Key", `Valid ${mode} mode key`);
    } else {
      error("Stripe Secret Key", "Invalid key format (should start with 'sk_test_' or 'sk_live_')");
    }

    if (webhookSecret && webhookSecret.trim() !== "") {
      if (webhookSecret.startsWith("whsec_")) {
        success("Stripe Webhook Secret", "Valid format");
      } else {
        error("Stripe Webhook Secret", "Invalid format (should start with 'whsec_')");
      }
    } else {
      warning("Stripe Webhook Secret", "Not configured (required for webhook handling)");
    }

    if (publishableKey && publishableKey.trim() !== "") {
      if (publishableKey.startsWith("pk_test_") || publishableKey.startsWith("pk_live_")) {
        success("Stripe Publishable Key", "Valid format");
      } else {
        error("Stripe Publishable Key", "Invalid format");
      }
    } else {
      warning("Stripe Publishable Key", "Not configured (required for client-side)");
    }

    // Check price IDs
    const priceIds = [
      "STRIPE_PRICE_ID_BASIC_MONTHLY",
      "STRIPE_PRICE_ID_BASIC_YEARLY",
      "STRIPE_PRICE_ID_PRO_MONTHLY",
      "STRIPE_PRICE_ID_PRO_YEARLY",
      "STRIPE_PRICE_ID_ENTERPRISE_MONTHLY",
      "STRIPE_PRICE_ID_ENTERPRISE_YEARLY",
    ];

    const configuredPrices = priceIds.filter((id) => {
      const value = process.env[id];
      return value && value.trim() !== "";
    });

    if (configuredPrices.length === 0) {
      warning("Stripe Price IDs", "No price IDs configured. Set these to enable subscriptions.");
    } else if (configuredPrices.length === priceIds.length) {
      success("Stripe Price IDs", `All ${priceIds.length} price IDs configured`);
    } else {
      warning(
        "Stripe Price IDs",
        `${configuredPrices.length}/${priceIds.length} price IDs configured`
      );
    }
  } catch (err) {
    error("Stripe", `Error: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ============================================
// 6. Dependencies Check
// ============================================

async function checkDependencies() {
  header("Critical Dependencies");

  const criticalDeps = [
    "next",
    "react",
    "prisma",
    "@prisma/client",
    "better-auth",
    "stripe",
    "@stripe/stripe-js",
    "resend",
    "zod",
    "date-fns",
  ];

  try {
    const packageJson = require("../package.json");
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    for (const dep of criticalDeps) {
      if (allDeps[dep]) {
        success(dep, `Installed (${allDeps[dep]})`);
      } else {
        error(dep, "Not installed. Run: pnpm install");
      }
    }
  } catch (err) {
    error("Dependencies", "Could not read package.json");
  }
}

// ============================================
// 7. File Structure Check
// ============================================

async function checkFileStructure() {
  header("Critical Files & Folders");

  const fs = require("fs");
  const path = require("path");

  const criticalPaths = [
    { path: "src/app/api", type: "dir", description: "API routes directory" },
    { path: "src/lib/auth.ts", type: "file", description: "BetterAuth configuration" },
    { path: "src/lib/db/index.ts", type: "file", description: "Prisma client" },
    { path: "src/middleware.ts", type: "file", description: "Auth middleware" },
    { path: "prisma/schema.prisma", type: "file", description: "Database schema" },
    { path: ".env", type: "file", description: "Environment variables" },
  ];

  for (const { path: filePath, type, description } of criticalPaths) {
    const fullPath = path.join(process.cwd(), filePath);

    try {
      const stats = fs.statSync(fullPath);
      const isCorrectType =
        (type === "file" && stats.isFile()) || (type === "dir" && stats.isDirectory());

      if (isCorrectType) {
        success(filePath, description);
      } else {
        error(filePath, `Expected ${type} but found ${stats.isFile() ? "file" : "directory"}`);
      }
    } catch (err) {
      error(filePath, `Not found (${description})`);
    }
  }
}

// ============================================
// Main Execution
// ============================================

async function main() {
  console.log(`\n${bright}${cyan}╔════════════════════════════════════════════════╗${reset}`);
  console.log(`${bright}${cyan}║  Next.js 16 SaaS Template - Setup Verification ║${reset}`);
  console.log(`${bright}${cyan}╚════════════════════════════════════════════════╝${reset}\n`);

  // Run all checks
  checkEnvVariables();
  await checkDatabaseConnection();
  await checkPrismaClient();
  await checkEmailService();
  await checkStripeConfiguration();
  await checkDependencies();
  await checkFileStructure();

  // Summary
  header("Summary");

  const requiredChecks = results.filter((r) => !r.optional);
  const optionalChecks = results.filter((r) => r.optional);

  const requiredPassed = requiredChecks.filter((r) => r.passed).length;
  const requiredFailed = requiredChecks.filter((r) => !r.passed).length;

  const optionalPassed = optionalChecks.filter((r) => r.passed).length;
  const optionalWarnings = optionalChecks.filter((r) => !r.passed).length;

  console.log(`Required Checks: ${green}${requiredPassed} passed${reset}, ${red}${requiredFailed} failed${reset}`);
  console.log(`Optional Checks: ${green}${optionalPassed} configured${reset}, ${yellow}${optionalWarnings} skipped${reset}`);
  console.log(`Total: ${results.length} checks performed\n`);

  if (requiredFailed === 0) {
    console.log(`${bright}${green}✓ All required checks passed!${reset}`);
    console.log(`${cyan}Your project is ready to run.${reset}\n`);

    if (optionalWarnings > 0) {
      console.log(`${yellow}Note: Some optional features are not configured.${reset}`);
      console.log(`${cyan}Check the warnings above if you need those features.${reset}\n`);
    }

    console.log(`${bright}Next steps:${reset}`);
    console.log(`  1. Run migrations: ${cyan}npx prisma migrate dev${reset}`);
    console.log(`  2. Seed database: ${cyan}npx prisma db seed${reset}`);
    console.log(`  3. Start dev server: ${cyan}npm run dev${reset}\n`);

    process.exit(0);
  } else {
    console.log(`${bright}${red}✗ Some required checks failed!${reset}`);
    console.log(`${cyan}Please fix the errors above before running the app.${reset}\n`);

    console.log(`${bright}Quick fixes:${reset}`);
    console.log(`  • Missing env vars: Copy .env.example to .env and fill in values`);
    console.log(`  • Database issues: Check DATABASE_URL and run migrations`);
    console.log(`  • Prisma errors: Run ${cyan}npx prisma generate${reset}`);
    console.log(`  • Missing deps: Run ${cyan}pnpm install${reset}\n`);

    process.exit(1);
  }
}

// Run verification
main().catch((err) => {
  console.error(`${red}Verification script error:${reset}`, err);
  process.exit(1);
});
