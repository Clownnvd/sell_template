import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prismaMock } from "@/test/mocks/prisma";
import { stripeMock } from "@/test/mocks/stripe";

// Mock rate limiting (allow all)
vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn().mockResolvedValue(null),
  rateLimitPresets: {
    webhook: { interval: 60000, maxRequests: 100 },
  },
}));

// Mock GitHub invite
vi.mock("@/lib/github/invite", () => ({
  inviteCollaborator: vi.fn().mockResolvedValue({ success: true, alreadyCollaborator: false }),
}));

function recentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

describe("POST /api/webhooks/stripe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when stripe-signature header is missing", async () => {
    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: "{}",
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it("returns 400 when signature verification fails", async () => {
    stripeMock.webhooks.constructEvent.mockImplementation(() => {
      throw new Error("Signature verification failed");
    });

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "t=123,v1=invalid" },
      body: "{}",
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it("returns 200 with received:true for already-processed event (idempotency)", async () => {
    stripeMock.webhooks.constructEvent.mockReturnValue({
      id: "evt_already_processed",
      type: "checkout.session.completed",
      created: recentTimestamp(),
      data: { object: {} },
    });
    prismaMock.webhookEvent.findUnique.mockResolvedValue({ id: "evt_already_processed" });

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "t=123,v1=valid" },
      body: "{}",
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
  });

  it("processes checkout.session.completed and creates purchase", async () => {
    const mockSession = {
      mode: "payment",
      metadata: { userId: "user_1" },
      payment_intent: "pi_123",
      amount_total: 9900,
      customer: "cus_123",
    };

    stripeMock.webhooks.constructEvent.mockReturnValue({
      id: "evt_new",
      type: "checkout.session.completed",
      created: recentTimestamp(),
      data: { object: mockSession },
    });

    // Not yet processed
    prismaMock.webhookEvent.findUnique.mockResolvedValue(null);
    // User exists
    prismaMock.user.findUnique.mockResolvedValue({ id: "user_1", githubUsername: null });
    // No existing purchase
    prismaMock.purchase.findUnique.mockResolvedValue(null);
    // Create purchase
    prismaMock.purchase.create.mockResolvedValue({ id: "purchase_1" });
    // Mark event processed
    prismaMock.webhookEvent.create.mockResolvedValue({});

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "t=123,v1=valid" },
      body: JSON.stringify({}),
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(prismaMock.purchase.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user_1",
          stripePaymentId: "pi_123",
          amount: 9900,
          status: "COMPLETED",
        }),
      })
    );
  });

  it("returns 400 when event is too old (replay protection)", async () => {
    stripeMock.webhooks.constructEvent.mockReturnValue({
      id: "evt_old",
      type: "checkout.session.completed",
      created: Math.floor(Date.now() / 1000) - 600,
      data: { object: {} },
    });

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "t=123,v1=valid" },
      body: "{}",
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
  });
});
