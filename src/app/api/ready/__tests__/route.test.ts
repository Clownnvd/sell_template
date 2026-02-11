import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prismaMock } from "@/test/mocks/prisma";

// Mock rate limiting (allow all)
vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn().mockResolvedValue(null),
  addRateLimitHeaders: vi.fn((_req: unknown, res: unknown) => res),
  rateLimitPresets: {
    relaxed: { interval: 60000, maxRequests: 60 },
  },
}));

describe("GET /api/ready", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns ready when all checks pass", async () => {
    prismaMock.$queryRaw.mockResolvedValue([{ "?column?": 1 }]);

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/ready");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ready).toBe(true);
    expect(data.checks.database).toBe("ok");
    expect(data.checks.env).toBe("ok");
  });

  it("returns 503 when database is unreachable", async () => {
    prismaMock.$queryRaw.mockRejectedValue(new Error("Connection refused"));

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/ready");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.ready).toBe(false);
    expect(data.checks.database).toBe("fail");
  });

  it("sets short-lived public Cache-Control header", async () => {
    prismaMock.$queryRaw.mockResolvedValue([{ "?column?": 1 }]);

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/ready");
    const response = await GET(req);

    expect(response.headers.get("Cache-Control")).toBe("public, max-age=5, s-maxage=5");
  });
});
