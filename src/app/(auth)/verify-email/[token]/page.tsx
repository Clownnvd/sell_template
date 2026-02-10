import { VerifyEmailContent } from "@/components/auth/verify-email-content";

interface VerifyEmailPageProps {
  params: Promise<{ token: string }>;
}

export default function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  return <VerifyEmailContent params={params} />;
}
