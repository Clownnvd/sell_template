import { vi } from "vitest";

export const prismaMock = {
  user: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
  purchase: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  webhookEvent: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
};

vi.mock("@/lib/db", () => ({
  default: prismaMock,
}));
