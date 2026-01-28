"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { icons } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface VerifyEmailPageProps {
  params: Promise<{ token: string }>;
}

type VerificationState = "verifying" | "success" | "error" | "expired";

export default function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const router = useRouter();
  const [state, setState] = useState<VerificationState>("verifying");
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const { token } = use(params);

  useEffect(() => {
    async function verifyEmail() {
      try {
        const response = await fetch(`/api/auth/verify-email/${token}`, {
          method: "POST",
        });

        if (response.ok) {
          setState("success");
          // Start countdown
          const interval = setInterval(() => {
            setCountdown((prev: number) => {
              if (prev <= 1) {
                clearInterval(interval);
                router.push("/dashboard");
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          const data = await response.json();
          if (data.error?.includes("expired")) {
            setState("expired");
          } else {
            setState("error");
            setError(data.error || "Verification failed");
          }
        }
      } catch (err) {
        setState("error");
        setError("An unexpected error occurred");
      }
    }

    verifyEmail();
  }, [token, router]);

  const handleResend = async () => {
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
      });

      if (response.ok) {
        alert("Verification email sent! Please check your inbox.");
      } else {
        alert("Failed to resend email. Please try again.");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center p-8 text-center">
          {state === "verifying" && (
            <>
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <icons.refresh className="size-8 animate-spin text-primary" />
              </div>
              <h1 className="mt-4 text-2xl font-bold">Verifying your email...</h1>
              <p className="mt-2 text-muted-foreground">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {state === "success" && (
            <>
              <div className="flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <icons.success className="size-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="mt-4 text-2xl font-bold">Email verified!</h1>
              <p className="mt-2 text-muted-foreground">
                Your email has been successfully verified.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Redirecting to dashboard in {countdown} seconds...
              </p>
              <Button
                onClick={() => router.push("/dashboard")}
                className="mt-6"
              >
                Go to Dashboard
              </Button>
            </>
          )}

          {state === "expired" && (
            <>
              <div className="flex size-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <icons.alert className="size-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h1 className="mt-4 text-2xl font-bold">Link expired</h1>
              <p className="mt-2 text-muted-foreground">
                This verification link has expired. Request a new one to verify
                your email.
              </p>
              <Button onClick={handleResend} className="mt-6">
                Resend Verification Email
              </Button>
            </>
          )}

          {state === "error" && (
            <>
              <div className="flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <icons.error className="size-8 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="mt-4 text-2xl font-bold">Verification failed</h1>
              <p className="mt-2 text-muted-foreground">
                {error || "We couldn't verify your email. Please try again."}
              </p>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={handleResend}>
                  Resend Email
                </Button>
                <Button onClick={() => router.push("/sign-in")}>
                  Go to Sign In
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
