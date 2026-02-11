import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock auth/server — requireAuth() used by route
const mockRequireAuth = vi.fn();
vi.mock("@/lib/auth/server", () => ({
  requireAuth: () => mockRequireAuth(),
  getServerSession: vi.fn(),
  getCurrentUser: vi.fn(),
  requireUserId: vi.fn(),
}));

// Mock CSRF (allow all)
vi.mock("@/lib/csrf", () => ({
  verifyCsrf: vi.fn().mockReturnValue(null),
}));

// Mock rate limiting (allow all)
vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn().mockResolvedValue(null),
  addRateLimitHeaders: vi.fn((_req: unknown, res: unknown) => res),
  rateLimitPresets: {
    strict: { interval: 60000, maxRequests: 5 },
    relaxed: { interval: 60000, maxRequests: 60 },
  },
}));

// Mock SePay service
const mockCreateSepayPurchase = vi.fn();
const mockGetSepayPurchaseStatus = vi.fn();
vi.mock("@/lib/payment/sepay-service", () => ({
  createSepayPurchase: (...args: unknown[]) => mockCreateSepayPurchase(...args),
  getSepayPurchaseStatus: (...args: unknown[]) => mockGetSepayPurchaseStatus(...args),
}));

describe("POST /api/checkout/sepay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockRequireAuth.mockRejectedValue(new Error("Unauthorized: Authentication required"));

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/checkout/sepay", { method: "POST" });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.code).toBe("UNAUTHORIZED");
  });

  it("returns QR code data on success", async () => {
    mockRequireAuth.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com" },
    });
    mockCreateSepayPurchase.mockResolvedValue({
      purchaseId: "pur_1",
      paymentCode: "KT12345678",
      amount: 2499000,
      qrUrl: "https://qr.sepay.vn/img?test",
      bankAccount: "123456789",
      bankCode: "VCB",
      expiresAt: new Date("2025-01-15T10:30:00Z"),
    });

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/checkout/sepay", { method: "POST" });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.paymentCode).toBe("KT12345678");
    expect(data.data.amount).toBe(2499000);
    expect(data.data.qrUrl).toBeTruthy();
    // Should NOT expose internal purchaseId
    expect(data.data.purchaseId).toBeUndefined();
  });

  it("returns 409 when already purchased", async () => {
    mockRequireAuth.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com" },
    });
    mockCreateSepayPurchase.mockRejectedValue(new Error("You have already purchased this product"));

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/checkout/sepay", { method: "POST" });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.success).toBe(false);
    expect(data.code).toBe("CONFLICT");
  });
});

describe("GET /api/checkout/sepay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockRequireAuth.mockRejectedValue(new Error("Unauthorized: Authentication required"));

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/checkout/sepay?id=test_123");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it("returns 400 for invalid purchase ID format", async () => {
    mockRequireAuth.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com" },
    });

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/checkout/sepay?id=../../../etc/passwd");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.code).toBe("VALIDATION_ERROR");
  });

  it("returns 404 when purchase not found", async () => {
    mockRequireAuth.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com" },
    });
    mockGetSepayPurchaseStatus.mockResolvedValue(null);

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/checkout/sepay?id=nonexistent_id");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.code).toBe("NOT_FOUND");
  });

  it("returns purchase status on success", async () => {
    mockRequireAuth.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com" },
    });
    mockGetSepayPurchaseStatus.mockResolvedValue({
      id: "pur_1",
      status: "PENDING",
      paymentCode: "KT12345678",
      amount: 2499000,
      currency: "VND",
      expiresAt: new Date("2025-01-15T10:30:00Z"),
      paymentMethod: "SEPAY",
    });

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/checkout/sepay?id=pur_1");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.status).toBe("PENDING");
  });
});
