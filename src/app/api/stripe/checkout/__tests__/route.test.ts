import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock auth
const mockRequireAuth = vi.fn();
vi.mock("@/lib/auth/server", () => ({
  requireAuth: () => mockRequireAuth(),
}));

// Mock payment service
const mockCreateCheckoutSession = vi.fn();
vi.mock("@/lib/payment/service", () => ({
  createCheckoutSession: (...args: unknown[]) => mockCreateCheckoutSession(...args),
}));

// Mock rate limiting (allow all)
vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn().mockResolvedValue(null),
  addRateLimitHeaders: vi.fn((_req: unknown, res: unknown) => res),
  rateLimitPresets: {
    strict: { interval: 60000, maxRequests: 5 },
  },
}));

// Mock CSRF (allow all)
vi.mock("@/lib/csrf", () => ({
  verifyCsrf: vi.fn().mockReturnValue(null),
}));

// Mock logger
vi.mock("@/lib/api/logger", () => ({
  logRequest: vi.fn(),
}));

describe("POST /api/stripe/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  });

  it("returns 415 when Content-Type is not JSON", async () => {
    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/stripe/checkout", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: "not json",
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(415);
    expect(data.code).toBe("UNSUPPORTED_MEDIA_TYPE");
  });

  it("returns 401 when not authenticated", async () => {
    mockRequireAuth.mockRejectedValue(new Error("Unauthorized: Authentication required"));

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/stripe/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.code).toBe("UNAUTHORIZED");
  });

  it("returns 409 when user already purchased", async () => {
    mockRequireAuth.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com" },
    });
    mockCreateCheckoutSession.mockRejectedValue(
      new Error("You have already purchased this product")
    );

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/stripe/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.code).toBe("CONFLICT");
  });

  it("returns checkout URL on success", async () => {
    mockRequireAuth.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com" },
    });
    mockCreateCheckoutSession.mockResolvedValue({
      url: "https://checkout.stripe.com/session_123",
    });

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/stripe/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.url).toBe("https://checkout.stripe.com/session_123");
  });
});
