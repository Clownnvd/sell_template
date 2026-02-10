import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock } from "@/test/mocks/prisma";
import { stripeMock } from "@/test/mocks/stripe";

describe("Purchase Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("hasPurchased", () => {
    it("returns true when user has a completed purchase", async () => {
      prismaMock.purchase.findFirst.mockResolvedValue({ id: "purchase_1" });

      const { hasPurchased } = await import("../service");
      const result = await hasPurchased("user_1");

      expect(result).toBe(true);
      expect(prismaMock.purchase.findFirst).toHaveBeenCalledWith({
        where: { userId: "user_1", status: "COMPLETED" },
        select: { id: true },
      });
    });

    it("returns false when user has no purchase", async () => {
      prismaMock.purchase.findFirst.mockResolvedValue(null);

      const { hasPurchased } = await import("../service");
      const result = await hasPurchased("user_1");

      expect(result).toBe(false);
    });
  });

  describe("getPurchase", () => {
    it("returns purchase record when exists", async () => {
      const mockPurchase = {
        id: "purchase_1",
        status: "COMPLETED",
        productType: "KING_TEMPLATE",
        amount: 9900,
        currency: "USD",
        githubInviteSent: false,
        githubUsername: null,
        purchasedAt: new Date(),
        createdAt: new Date(),
      };
      prismaMock.purchase.findFirst.mockResolvedValue(mockPurchase);

      const { getPurchase } = await import("../service");
      const result = await getPurchase("user_1");

      expect(result).toEqual(mockPurchase);
      expect(prismaMock.purchase.findFirst).toHaveBeenCalledWith({
        where: { userId: "user_1", status: "COMPLETED" },
        select: {
          id: true,
          status: true,
          productType: true,
          amount: true,
          currency: true,
          githubInviteSent: true,
          githubUsername: true,
          purchasedAt: true,
          createdAt: true,
        },
      });
    });

    it("returns null when no purchase exists", async () => {
      prismaMock.purchase.findFirst.mockResolvedValue(null);

      const { getPurchase } = await import("../service");
      const result = await getPurchase("user_1");

      expect(result).toBeNull();
    });
  });

  describe("createCheckoutSession", () => {
    it("creates a checkout session with mode 'payment'", async () => {
      prismaMock.purchase.findFirst.mockResolvedValue(null);
      stripeMock.customers.create.mockResolvedValue({ id: "cus_123" });
      stripeMock.checkout.sessions.create.mockResolvedValue({
        url: "https://checkout.stripe.com/session_123",
      });

      const { createCheckoutSession } = await import("../service");
      const result = await createCheckoutSession({
        userId: "user_1",
        email: "test@example.com",
        successUrl: "https://example.com/success",
        cancelUrl: "https://example.com/cancel",
      });

      expect(result.url).toBe("https://checkout.stripe.com/session_123");
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: "payment",
          metadata: { userId: "user_1" },
        })
      );
    });

    it("throws error if user already purchased", async () => {
      prismaMock.purchase.findFirst.mockResolvedValue({ id: "purchase_1", status: "COMPLETED" });

      const { createCheckoutSession } = await import("../service");

      await expect(
        createCheckoutSession({
          userId: "user_1",
          email: "test@example.com",
          successUrl: "https://example.com/success",
          cancelUrl: "https://example.com/cancel",
        })
      ).rejects.toThrow("You have already purchased this product");
    });
  });
});
