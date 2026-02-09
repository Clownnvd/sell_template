import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prismaMock } from "@/test/mocks/prisma";

// Mock rate limiting (allow all)
vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn().mockResolvedValue(null),
  rateLimitPresets: {
    webhook: { interval: 60000, maxRequests: 100 },
  },
}));

// Mock SePay service
const mockVerifySepayWebhook = vi.fn();
const mockProcessSepayTransaction = vi.fn();
vi.mock("@/lib/payment/sepay-service", () => ({
  verifySepayWebhook: (...args: unknown[]) => mockVerifySepayWebhook(...args),
  processSepayTransaction: (...args: unknown[]) => mockProcessSepayTransaction(...args),
}));

const validTransaction = {
  id: 12345,
  gateway: "MBBank",
  transactionDate: "2025-01-15",
  accountNumber: "123456789",
  code: null,
  content: "KT-ABCDEFGH payment",
  transferType: "in",
  transferAmount: 2500000,
  accumulated: 2500000,
  subAccount: null,
  referenceCode: "REF123",
};

describe("POST /api/webhooks/sepay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when API key is invalid", async () => {
    mockVerifySepayWebhook.mockReturnValue(false);

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/webhooks/sepay", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Apikey wrong_key",
      },
      body: JSON.stringify(validTransaction),
    });
    const response = await POST(req);

    expect(response.status).toBe(401);
  });

  it("returns 400 when body is invalid", async () => {
    mockVerifySepayWebhook.mockReturnValue(true);

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/webhooks/sepay", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Apikey valid_key",
      },
      body: JSON.stringify({ invalid: true }),
    });
    const response = await POST(req);

    expect(response.status).toBe(400);
  });

  it("returns 200 for already-processed event (idempotency)", async () => {
    mockVerifySepayWebhook.mockReturnValue(true);
    prismaMock.webhookEvent.findUnique.mockResolvedValue({ id: "sepay-12345" });

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/webhooks/sepay", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Apikey valid_key",
      },
      body: JSON.stringify(validTransaction),
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockProcessSepayTransaction).not.toHaveBeenCalled();
  });

  it("processes valid transaction successfully", async () => {
    mockVerifySepayWebhook.mockReturnValue(true);
    prismaMock.webhookEvent.findUnique.mockResolvedValue(null);
    mockProcessSepayTransaction.mockResolvedValue(undefined);
    prismaMock.webhookEvent.create.mockResolvedValue({});

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/webhooks/sepay", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Apikey valid_key",
      },
      body: JSON.stringify(validTransaction),
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockProcessSepayTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 12345,
        transferType: "in",
        transferAmount: 2500000,
      })
    );
  });
});
