import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { serverEnv } from "@/lib/env";

describe("GitHub Invite Service", () => {
  beforeEach(() => {
    vi.resetModules();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends invite and returns success for new collaborator (201)", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 201,
      ok: true,
    });

    const { inviteCollaborator } = await import("../invite");
    const result = await inviteCollaborator("testuser");

    expect(result.success).toBe(true);
    expect(result.alreadyCollaborator).toBe(false);
    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.github.com/repos/${serverEnv.GITHUB_REPO_OWNER}/${serverEnv.GITHUB_REPO_NAME}/collaborators/testuser`,
      expect.objectContaining({
        method: "PUT",
        headers: expect.objectContaining({
          Authorization: `Bearer ${serverEnv.GITHUB_PAT}`,
        }),
      })
    );
  });

  it("returns success for existing collaborator (204)", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 204,
      ok: true,
    });

    const { inviteCollaborator } = await import("../invite");
    const result = await inviteCollaborator("existinguser");

    expect(result.success).toBe(true);
    expect(result.alreadyCollaborator).toBe(true);
  });

  it("returns error for non-existent GitHub user (404)", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 404,
      ok: false,
      json: async () => ({ message: "Not Found" }),
    });

    const { inviteCollaborator } = await import("../invite");
    const result = await inviteCollaborator("nonexistentuser");

    expect(result.success).toBe(false);
    expect(result.error).toBe("GitHub user not found");
  });

  it("throws when GitHub integration is not configured", async () => {
    // Override serverEnv mock for this test to simulate missing config
    vi.doMock("@/lib/env", () => ({
      serverEnv: {
        GITHUB_PAT: undefined,
        GITHUB_REPO_OWNER: undefined,
        GITHUB_REPO_NAME: undefined,
      },
    }));

    const { inviteCollaborator } = await import("../invite");
    await expect(inviteCollaborator("testuser")).rejects.toThrow(
      "GitHub integration not configured"
    );
  });
});
