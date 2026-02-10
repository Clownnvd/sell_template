import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prismaMock } from "@/test/mocks/prisma";

// Mock auth/server — requireAuth() used by route
const mockRequireAuth = vi.fn();
vi.mock("@/lib/auth/server", () => ({
  requireAuth: () => mockRequireAuth(),
  getServerSession: vi.fn(),
  getCurrentUser: vi.fn(),
  requireUserId: vi.fn(),
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

// Mock CSRF (allow all)
vi.mock("@/lib/csrf", () => ({
  verifyCsrf: vi.fn().mockReturnValue(null),
}));

// Mock logger
vi.mock("@/lib/api/logger", () => ({
  logRequest: vi.fn(),
}));

describe("GET /api/user/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockRequireAuth.mockRejectedValue(new Error("Unauthorized: Authentication required"));

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/user/profile");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.code).toBe("UNAUTHORIZED");
  });

  it("returns 404 when user not found in DB", async () => {
    mockRequireAuth.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com" },
    });
    prismaMock.user.findUnique.mockResolvedValue(null);

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/user/profile");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.code).toBe("NOT_FOUND");
  });

  it("returns user profile for authenticated user", async () => {
    const createdAt = new Date("2025-01-01T00:00:00Z");
    mockRequireAuth.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com" },
    });
    prismaMock.user.findUnique.mockResolvedValue({
      id: "user_1",
      name: "Test User",
      email: "test@example.com",
      image: null,
      emailVerified: true,
      createdAt,
    });

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/user/profile");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.email).toBe("test@example.com");
    expect(data.data.createdAt).toBe("2025-01-01T00:00:00.000Z");
  });
});

describe("PATCH /api/user/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockRequireAuth.mockRejectedValue(new Error("Unauthorized: Authentication required"));

    const { PATCH } = await import("../route");
    const req = new NextRequest("http://localhost/api/user/profile", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "New Name" }),
    });
    const response = await PATCH(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.code).toBe("UNAUTHORIZED");
  });

  it("returns 415 when Content-Type is not JSON", async () => {
    const { PATCH } = await import("../route");
    const req = new NextRequest("http://localhost/api/user/profile", {
      method: "PATCH",
      headers: { "content-type": "text/plain" },
      body: "name=test",
    });
    const response = await PATCH(req);
    const data = await response.json();

    expect(response.status).toBe(415);
    expect(data.code).toBe("UNSUPPORTED_MEDIA_TYPE");
  });

  it("returns 400 for invalid body", async () => {
    mockRequireAuth.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com" },
    });

    const { PATCH } = await import("../route");
    const req = new NextRequest("http://localhost/api/user/profile", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "" }),
    });
    const response = await PATCH(req);

    expect(response.status).toBe(400);
  });

  it("updates profile successfully", async () => {
    const createdAt = new Date("2025-01-01T00:00:00Z");
    mockRequireAuth.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com" },
    });
    prismaMock.user.update.mockResolvedValue({
      id: "user_1",
      name: "Updated Name",
      email: "test@example.com",
      image: null,
      emailVerified: true,
      createdAt,
    });

    const { PATCH } = await import("../route");
    const req = new NextRequest("http://localhost/api/user/profile", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Updated Name" }),
    });
    const response = await PATCH(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.name).toBe("Updated Name");
  });
});
