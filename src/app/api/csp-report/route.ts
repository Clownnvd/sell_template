import { NextRequest, NextResponse } from "next/server";
import { rateLimit, rateLimitPresets, addRateLimitHeaders } from "@/lib/rate-limit";
import { logger } from "@/lib/api/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/csp-report
 * Receives Content-Security-Policy violation reports.
 * @auth None (browser sends reports automatically)
 * @rateLimit 100/min
 */
export async function POST(req: NextRequest) {
  const rateLimitResult = await rateLimit(req, rateLimitPresets.webhook, "csp-report");
  if (rateLimitResult) return rateLimitResult;

  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (contentLength > 10_240) {
    return NextResponse.json({ received: false }, { status: 413 });
  }

  try {
    const body = await req.json();

    // CSP reports come in two formats:
    // 1. report-uri format: { "csp-report": { ... } }
    // 2. Reporting API format: [{ "type": "csp-violation", "body": { ... } }]
    const report = body["csp-report"] ?? body;

    logger.warn("csp_violation", {
      blockedUri: report["blocked-uri"] ?? report.blockedURL,
      violatedDirective: report["violated-directive"] ?? report.effectiveDirective,
      documentUri: report["document-uri"] ?? report.documentURL,
    });

    return addRateLimitHeaders(req, NextResponse.json({ received: true }, { status: 204 }));
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }
}
