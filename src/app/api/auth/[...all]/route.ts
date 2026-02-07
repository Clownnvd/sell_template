import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";

const { POST: authPost, GET: authGet } = toNextJsHandler(auth);

export async function POST(req: NextRequest) {
  const rateLimitResult = await rateLimit(req, rateLimitPresets.strict, "auth");
  if (rateLimitResult) return rateLimitResult;
  return authPost(req);
}

export async function GET(req: NextRequest) {
  const rateLimitResult = await rateLimit(req, rateLimitPresets.standard, "auth-get");
  if (rateLimitResult) return rateLimitResult;
  return authGet(req);
}
