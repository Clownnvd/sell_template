import { Resend } from "resend";
import type React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendReactEmailParams = {
  to: string;
  subject: string;
  react: React.ReactElement;
};

export async function sendReactEmail(params: SendReactEmailParams) {
  const from = process.env.RESEND_FROM;
  if (!process.env.RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
  if (!from) throw new Error("Missing RESEND_FROM");

  // ✅ returning the promise is fine
  return resend.emails.send({
    from,
    to: [params.to],
    subject: params.subject,
    react: params.react,
  });
}

// ✅ helper to "fire-and-forget" safely
export function sendReactEmailSafe(params: SendReactEmailParams) {
  void sendReactEmail(params).catch((err) => {
    console.error("[email] send failed:", err);
  });
}
