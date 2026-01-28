import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./index";

/**
 * Get server session (cached per request)
 * Use this in Server Components and Server Actions
 */
export const getServerSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
});

/**
 * Get current user from session
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getServerSession();
  return session?.user ?? null;
}

/**
 * Require authentication
 * Throws error if user is not authenticated
 * Use this in Server Actions that require auth
 */
export async function requireAuth() {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Unauthorized: Authentication required");
  }

  return session;
}

/**
 * Get user ID from session
 * Throws error if not authenticated
 */
export async function requireUserId() {
  const session = await requireAuth();
  return session.user.id;
}
