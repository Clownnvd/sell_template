import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: `tsx prisma/seed.ts`,
  },
  datasource: {
    // Migration engine uses DIRECT_URL (bypasses pgbouncer) — falls back to DATABASE_URL
    // App queries use DATABASE_URL (pooled via pgbouncer) in src/lib/db/index.ts
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
