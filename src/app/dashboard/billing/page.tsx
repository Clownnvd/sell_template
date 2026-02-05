"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Forward Stripe callback params to dashboard
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success === "true") {
      router.replace("/dashboard?billing=success");
    } else if (canceled === "true") {
      router.replace("/dashboard?billing=canceled");
    } else {
      router.replace("/dashboard");
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}
