import { z } from "zod";

export const githubUsernameSchema = z
  .string()
  .min(1, "GitHub username is required")
  .max(39, "GitHub username too long")
  .regex(
    /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/,
    "Invalid GitHub username format"
  );

export const updateGithubUsernameSchema = z.object({
  githubUsername: githubUsernameSchema,
}).strict();
