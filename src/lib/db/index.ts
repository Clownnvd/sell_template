import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Append statement_timeout (10s) to prevent long-running queries from blocking
const dbUrl = new URL(process.env.DATABASE_URL!);
if (!dbUrl.searchParams.has("options")) {
  dbUrl.searchParams.set("options", "-c statement_timeout=10000");
}
const adapter = new PrismaNeon({ connectionString: dbUrl.toString() });

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const SLOW_QUERY_THRESHOLD_MS = 1000;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? [
            { emit: "event", level: "query" },
            { emit: "stdout", level: "warn" },
            { emit: "stdout", level: "error" },
          ]
        : [
            { emit: "event", level: "query" },
            { emit: "stdout", level: "warn" },
            { emit: "stdout", level: "error" },
          ],
  });

// Structured slow query detection — JSON in production, readable in dev
// @ts-expect-error -- Prisma event typing varies by adapter; runtime works correctly
prisma.$on("query", (e: { duration: number; query: string }) => {
  if (e.duration > SLOW_QUERY_THRESHOLD_MS) {
    const sanitized = e.query.replace(/\$\d+/g, "?");
    if (process.env.NODE_ENV === "production") {
      console.warn(
        JSON.stringify({
          level: "warn",
          event: "slow_query",
          durationMs: e.duration,
          threshold: SLOW_QUERY_THRESHOLD_MS,
          timestamp: new Date().toISOString(),
        })
      );
    } else {
      console.warn(
        `[SLOW QUERY] ${e.duration}ms: ${sanitized.slice(0, 200)}`
      );
    }
  }
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
