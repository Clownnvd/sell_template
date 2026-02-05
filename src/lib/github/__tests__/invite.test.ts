import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("GitHub Invite Service", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      GITHUB_PAT: "ghp_test_token_123",
      GITHUB_REPO_OWNER: "Clownnvd",
      GITHUB_REPO_NAME: "king-template",
    };
    global.fetch = vi.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
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
      "https://api.github.com/repos/Clownnvd/king-template/collaborators/testuser",
      expect.objectContaining({
        method: "PUT",
        headers: expect.objectContaining({
          Authorization: "Bearer ghp_test_token_123",
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
    process.env.GITHUB_PAT = "";

    const { inviteCollaborator } = await import("../invite");
    await expect(inviteCollaborator("testuser")).rejects.toThrow(
      "GitHub integration not configured"
    );
  });
});
