import { NextRequest, NextResponse } from "next/server";
import { WelcomeEmail } from "@/lib/email/templates/email-template";
import { Resend } from "resend";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";
import { auth } from "@/lib/auth";
import { verifyCsrf } from "@/lib/csrf";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  // CSRF protection
  const csrfResult = verifyCsrf(req);
  if (csrfResult) return csrfResult;

  // Authentication required - prevent spam abuse
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  // Rate limiting: 5 requests per minute for email sending
  const rateLimitResult = await rateLimit(req, rateLimitPresets.strict, "send-email");
  if (rateLimitResult) return rateLimitResult;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'Hello world',
      react: WelcomeEmail({ firstName: 'John' }),
    });

    if (error) {
      return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}