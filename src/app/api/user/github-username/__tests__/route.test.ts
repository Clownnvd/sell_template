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
  },
}));

// Mock CSRF (allow all)
vi.mock("@/lib/csrf", () => ({
  verifyCsrf: vi.fn().mockReturnValue(null),
}));

// Mock GitHub invite
const mockInviteCollaborator = vi.fn();
vi.mock("@/lib/github/invite", () => ({
  inviteCollaborator: (...args: unknown[]) => mockInviteCollaborator(...args),
}));

// Mock logger
vi.mock("@/lib/api/logger", () => ({
  logRequest: vi.fn(),
}));

describe("PATCH /api/user/github-username", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockGetSession.mockResolvedValue(null);

    const { PATCH } = await import("../route");
    const req = new NextRequest("http://localhost/api/user/github-username", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ githubUsername: "testuser" }),
    });
    const response = await PATCH(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.code).toBe("UNAUTHORIZED");
  });

  it("returns 415 when Content-Type is not JSON", async () => {
    const { PATCH } = await import("../route");
    const req = new NextRequest("http://localhost/api/user/github-username", {
      method: "PATCH",
      headers: { "content-type": "text/plain" },
      body: "githubUsername=test",
    });
    const response = await PATCH(req);
    const data = await response.json();

    expect(response.status).toBe(415);
    expect(data.code).toBe("UNSUPPORTED_MEDIA_TYPE");
  });

  it("returns 400 for invalid GitHub username", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com" },
    });

    const { PATCH } = await import("../route");
    const req = new NextRequest("http://localhost/api/user/github-username", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ githubUsername: "-invalid" }),
    });
    const response = await PATCH(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.code).toBe("VALIDATION_ERROR");
  });

  it("updates username and sends invite on valid request", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com" },
    });
    prismaMock.user.update.mockResolvedValue({ id: "user_1", githubUsername: "validuser" });
    prismaMock.purchase.findFirst.mockResolvedValue({
      id: "purchase_1",
      status: "COMPLETED",
      githubInviteSent: false,
    });
    mockInviteCollaborator.mockResolvedValue({ success: true, alreadyCollaborator: false });
    prismaMock.purchase.update.mockResolvedValue({});

    const { PATCH } = await import("../route");
    const req = new NextRequest("http://localhost/api/user/github-username", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ githubUsername: "validuser" }),
    });
    const response = await PATCH(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.githubUsername).toBe("validuser");
    expect(data.data.invite.sent).toBe(true);
    expect(mockInviteCollaborator).toHaveBeenCalledWith("validuser");
  });

  it("rejects XSS attempt in username", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com" },
    });

    const { PATCH } = await import("../route");
    const req = new NextRequest("http://localhost/api/user/github-username", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ githubUsername: "<script>alert(1)</script>" }),
    });
    const response = await PATCH(req);

    expect(response.status).toBe(400);
  });
});
