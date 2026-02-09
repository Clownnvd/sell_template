import { describe, it, expect } from "vitest";
import { githubUsernameSchema } from "@/lib/validations/github";

describe("githubUsernameSchema", () => {
  it.each([
    ["octocat"],
    ["user-name"],
    ["a"],
    ["a".repeat(39)],
    ["user123"],
  ])("accepts valid username: %s", (username) => {
    const result = githubUsernameSchema.safeParse(username);
    expect(result.success).toBe(true);
  });

  it.each([
    ["", "empty string"],
    ["a".repeat(40), "too long (40 chars)"],
    ["-invalid", "starts with hyphen"],
    ["invalid-", "ends with hyphen"],
    ["in--valid", "consecutive hyphens"],
    ["<script>alert(1)</script>", "XSS attempt"],
    ["user name", "contains space"],
    ["user.name", "contains dot"],
    ["user@name", "contains @"],
  ])("rejects invalid username: %s (%s)", (username) => {
    const result = githubUsernameSchema.safeParse(username);
    expect(result.success).toBe(false);
  });
});
