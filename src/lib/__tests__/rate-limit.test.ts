import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

// Uses the actual in-memory implementation (no Redis in test env)

function createRequest(ip = "127.0.0.1"): NextRequest {
  return new NextRequest("http://localhost/api/test", {
    headers: { "x-forwarded-for": ip },
  });
}

describe("rateLimit", () => {
  it("allows requests under the limit", async () => {
    const config = { maxRequests: 3, interval: 60000 };
    const id = `test-allow-${Date.now()}`;

    const result1 = await rateLimit(createRequest(), config, id);
    const result2 = await rateLimit(createRequest(), config, id);
    const result3 = await rateLimit(createRequest(), config, id);

    expect(result1).toBeNull();
    expect(result2).toBeNull();
    expect(result3).toBeNull();
  });

  it("returns 429 when limit is exceeded", async () => {
    const config = { maxRequests: 2, interval: 60000 };
    const id = `test-exceed-${Date.now()}`;

    await rateLimit(createRequest(), config, id);
    await rateLimit(createRequest(), config, id);
    const result = await rateLimit(createRequest(), config, id);

    expect(result).not.toBeNull();
    expect(result!.status).toBe(429);

    const data = await result!.json();
    expect(data.error).toContain("Too many requests");
    expect(data.retryAfter).toBeGreaterThan(0);
  });

  it("includes rate limit headers on 429 response", async () => {
    const config = { maxRequests: 1, interval: 60000 };
    const id = `test-headers-${Date.now()}`;

    await rateLimit(createRequest(), config, id);
    const result = await rateLimit(createRequest(), config, id);

    expect(result).not.toBeNull();
    expect(result!.headers.get("Retry-After")).toBeTruthy();
    expect(result!.headers.get("X-RateLimit-Limit")).toBe("1");
    expect(result!.headers.get("X-RateLimit-Remaining")).toBe("0");
  });

  it("rate limits per IP separately", async () => {
    const config = { maxRequests: 1, interval: 60000 };
    const id = `test-per-ip-${Date.now()}`;

    const result1 = await rateLimit(createRequest("1.1.1.1"), config, id);
    const result2 = await rateLimit(createRequest("2.2.2.2"), config, id);

    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });

  it("rate limits per userId when provided", async () => {
    const config = { maxRequests: 1, interval: 60000 };
    const id = `test-per-user-${Date.now()}`;

    const result1 = await rateLimit(createRequest("1.1.1.1"), config, id, "user_1");
    const result2 = await rateLimit(createRequest("2.2.2.2"), config, id, "user_1");

    expect(result1).toBeNull();
    expect(result2).not.toBeNull();
    expect(result2!.status).toBe(429);
  });
});
