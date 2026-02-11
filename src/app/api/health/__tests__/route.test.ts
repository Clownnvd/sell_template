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

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns healthy when database is connected", async () => {
    prismaMock.$queryRaw.mockResolvedValue([{ "?column?": 1 }]);

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/health");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("healthy");
    expect(data.database).toBe("connected");
    expect(data.latencyMs).toBeTypeOf("number");
    expect(data.timestamp).toBeTruthy();
  });

  it("returns unhealthy (503) when database fails", async () => {
    prismaMock.$queryRaw.mockRejectedValue(new Error("Connection refused"));

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/health");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe("unhealthy");
    expect(data.database).toBe("disconnected");
  });

  it("sets Cache-Control header for short caching", async () => {
    prismaMock.$queryRaw.mockResolvedValue([{ "?column?": 1 }]);

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/health");
    const response = await GET(req);

    expect(response.headers.get("Cache-Control")).toBe("public, max-age=5, s-maxage=5");
  });
});
