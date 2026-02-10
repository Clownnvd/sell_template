import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prismaMock } from "@/test/mocks/prisma";

// Mock auth
const mockGetSession = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
  },
}));

// Mock rate limiting (allow all)
vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn().mockResolvedValue(null),
  rateLimitPresets: {
    strict: { interval: 60000, maxRequests: 5 },
    standard: { interval: 60000, maxRequests: 20 },
    relaxed: { interval: 60000, maxRequests: 60 },
  },
}));

// Mock logger (suppress output)
vi.mock("@/lib/api/logger", () => ({
  logRequest: vi.fn(),
}));

describe("GET /api/user/purchase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockGetSession.mockResolvedValue(null);

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/user/purchase");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.code).toBe("UNAUTHORIZED");
  });

  it("returns purchase data for authenticated user with purchase", async () => {
    const purchasedAt = new Date("2025-01-15T10:00:00Z");
    mockGetSession.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com" },
    });
    prismaMock.purchase.findUnique.mockResolvedValue({
      id: "purchase_1",
      status: "COMPLETED",
      productType: "KING_TEMPLATE",
      amount: 9900,
      githubInviteSent: true,
      githubUsername: "testuser",
      purchasedAt,
    });

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/user/purchase");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.purchased).toBe(true);
    expect(data.data.purchase.id).toBe("purchase_1");
    expect(data.data.purchase.purchasedAt).toBe("2025-01-15T10:00:00.000Z");
  });

  it("returns purchased=false when user has no purchase", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com" },
    });
    prismaMock.purchase.findUnique.mockResolvedValue(null);

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/user/purchase");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.purchased).toBe(false);
    expect(data.data.purchase).toBeNull();
  });
});
