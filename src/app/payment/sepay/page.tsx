import { Suspense } from "react";
import { SepayPaymentClient } from "@/components/payment/sepay-payment-client";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Thanh toán VietQR — King Template",
  description: "Thanh toán qua chuyển khoản ngân hàng với mã QR",
};

export default function SepayPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SepayPaymentClient />
    </Suspense>
  );
}
