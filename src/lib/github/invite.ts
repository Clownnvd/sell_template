import { serverEnv } from "@/lib/env";

interface GitHubInviteResult {
  success: boolean;
  alreadyCollaborator: boolean;
  error?: string;
}

export async function inviteCollaborator(
  githubUsername: string
): Promise<GitHubInviteResult> {
  const token = serverEnv.GITHUB_PAT;
  const owner = serverEnv.GITHUB_REPO_OWNER;
  const repo = serverEnv.GITHUB_REPO_NAME;

  if (!token || !owner || !repo) {
    throw new Error("GitHub integration not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  let response: Response;
  try {
    response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/collaborators/${githubUsername}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({ permission: "pull" }),
        signal: controller.signal,
      }
    );
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 201) {
    return { success: true, alreadyCollaborator: false };
  }

  if (response.status === 204) {
    return { success: true, alreadyCollaborator: true };
  }

  if (response.status === 404) {
    return { success: false, alreadyCollaborator: false, error: "GitHub user not found" };
  }

  // Don't leak GitHub API error details to the client
  return {
    success: false,
    alreadyCollaborator: false,
    error: "Failed to send GitHub invitation. Please try again later.",
  };
}
