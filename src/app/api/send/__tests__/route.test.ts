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
  },
}));

// Mock Resend
const mockSend = vi.fn();
vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = { send: mockSend };
  },
}));

// Mock email template
vi.mock("@/lib/email/templates/email-template", () => ({
  WelcomeEmail: vi.fn().mockReturnValue(null),
}));

describe("POST /api/send", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockRequireAuth.mockRejectedValue(new Error("Unauthorized: Authentication required"));

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/send", { method: "POST" });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.code).toBe("UNAUTHORIZED");
  });

  it("returns success when email is sent", async () => {
    mockRequireAuth.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com", name: "Test User" },
    });
    mockSend.mockResolvedValue({ data: { id: "email_123" }, error: null });

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/send", { method: "POST" });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.sent).toBe(true);
    expect(data.data.id).toBe("email_123");
  });

  it("returns 500 when email send fails", async () => {
    mockRequireAuth.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com", name: "Test User" },
    });
    mockSend.mockResolvedValue({ data: null, error: { message: "Failed" } });

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/send", { method: "POST" });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
  });
});
