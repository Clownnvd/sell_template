interface GitHubInviteResult {
  success: boolean;
  alreadyCollaborator: boolean;
  error?: string;
}

export async function inviteCollaborator(
  githubUsername: string
): Promise<GitHubInviteResult> {
  const token = process.env.GITHUB_PAT;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  if (!token || !owner || !repo) {
    throw new Error("GitHub integration not configured");
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/collaborators/${githubUsername}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({ permission: "pull" }),
    }
  );

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
