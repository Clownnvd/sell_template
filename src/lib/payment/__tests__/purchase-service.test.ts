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
    it("returns purchase record when exists and completed", async () => {
      const mockPurchase = {
        id: "purchase_1",
        status: "COMPLETED",
        productType: "KING_TEMPLATE",
        amount: 9900,
        githubInviteSent: false,
        githubUsername: null,
        purchasedAt: new Date(),
      };
      prismaMock.purchase.findUnique.mockResolvedValue(mockPurchase);

      const { getPurchase } = await import("../service");
      const result = await getPurchase("user_1");

      expect(result).toEqual(mockPurchase);
      expect(prismaMock.purchase.findUnique).toHaveBeenCalledWith({
        where: {
          one_purchase_per_product: { userId: "user_1", productType: "KING_TEMPLATE" },
        },
        select: {
          id: true,
          status: true,
          productType: true,
          amount: true,
          githubInviteSent: true,
          githubUsername: true,
          purchasedAt: true,
        },
      });
    });

    it("returns null when no purchase exists", async () => {
      prismaMock.purchase.findUnique.mockResolvedValue(null);

      const { getPurchase } = await import("../service");
      const result = await getPurchase("user_1");

      expect(result).toBeNull();
    });

    it("returns null when purchase is not completed", async () => {
      prismaMock.purchase.findUnique.mockResolvedValue({
        id: "purchase_1",
        status: "PENDING",
        productType: "KING_TEMPLATE",
        amount: 9900,
        githubInviteSent: false,
        githubUsername: null,
        purchasedAt: null,
      });

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
