import { vi } from "vitest";

export const stripeMock = {
  customers: {
    create: vi.fn(),
    retrieve: vi.fn(),
  },
  checkout: {
    sessions: {
      create: vi.fn(),
    },
  },
  webhooks: {
    constructEvent: vi.fn(),
  },
};

vi.mock("@/lib/payment/stripe", () => ({
  stripe: stripeMock,
}));
