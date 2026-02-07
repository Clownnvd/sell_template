"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Check,
  Copy,
  Clock,
  AlertCircle,
  ArrowLeft,
  Loader2,
  QrCode,
  Building2,
  CreditCard,
  FileText,
} from "lucide-react";
import { product } from "@/config/product";
import type { ApiResponse } from "@/types";
import Link from "next/link";

interface SepayPaymentData {
  purchaseId: string;
  paymentCode: string;
  amount: number;
  qrUrl: string;
  bankAccount: string;
  bankCode: string;
  expiresAt: string;
}

interface PurchaseStatus {
  id: string;
  status: "PENDING" | "COMPLETED" | "REFUNDED" | "EXPIRED";
  paymentCode: string;
  amount: number;
  currency: string;
  expiresAt: string | null;
}

type PaymentState =
  | { step: "loading" }
  | { step: "error"; message: string }
  | { step: "paying"; data: SepayPaymentData }
  | { step: "success" }
  | { step: "expired" };

const POLL_INTERVAL = 5000;

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount);
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
      title={`Copy ${label}`}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const target = new Date(expiresAt).getTime();

    const update = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft("00:00");
        return;
      }
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="size-4" />
      <span>
        Thời gian còn lại: <span className="font-mono font-semibold text-foreground">{timeLeft}</span>
      </span>
    </div>
  );
}

export function SepayPaymentClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<PaymentState>({ step: "loading" });
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Create payment on mount
  useEffect(() => {
    const purchaseId = searchParams.get("id");

    if (purchaseId) {
      // Resume polling for existing purchase
      pollPaymentStatus(purchaseId);
      return;
    }

    // Create new payment
    createPayment();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createPayment = async () => {
    try {
      const response = await fetch("/api/checkout/sepay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "fetch",
        },
      });

      const data: ApiResponse<SepayPaymentData> = await response.json();

      if (!data.success || !data.data) {
        setState({ step: "error", message: data.error || "Failed to create payment" });
        return;
      }

      setState({ step: "paying", data: data.data });

      // Update URL with purchase ID (without full navigation)
      window.history.replaceState({}, "", `/payment/sepay?id=${data.data.purchaseId}`);

      // Start polling
      startPolling(data.data.purchaseId);
    } catch {
      setState({ step: "error", message: "Network error. Please try again." });
    }
  };

  const pollPaymentStatus = async (purchaseId: string) => {
    try {
      const response = await fetch(`/api/checkout/sepay?id=${purchaseId}`);
      const data: ApiResponse<PurchaseStatus> = await response.json();

      if (!data.success || !data.data) {
        setState({ step: "error", message: "Payment not found" });
        return;
      }

      const status = data.data;

      if (status.status === "COMPLETED") {
        setState({ step: "success" });
        stopPolling();
        return;
      }

      if (status.status === "EXPIRED" || status.status === "REFUNDED") {
        setState({ step: "expired" });
        stopPolling();
        return;
      }

      // Still pending — if we don't have payment data yet, fetch it
      if (state.step === "loading") {
        // Reconstruct payment data from status for display
        const bankAccount = process.env.NEXT_PUBLIC_SEPAY_BANK_ACCOUNT || "";
        const bankCode = process.env.NEXT_PUBLIC_SEPAY_BANK_CODE || "";

        setState({
          step: "paying",
          data: {
            purchaseId: status.id,
            paymentCode: status.paymentCode,
            amount: status.amount,
            qrUrl: `https://qr.sepay.vn/img?acc=${bankAccount}&bank=${bankCode}&amount=${status.amount}&des=${status.paymentCode}&template=compact`,
            bankAccount,
            bankCode,
            expiresAt: status.expiresAt || new Date(Date.now() + 30 * 60000).toISOString(),
          },
        });
      }

      startPolling(purchaseId);
    } catch {
      setState({ step: "error", message: "Failed to check payment status" });
    }
  };

  const startPolling = useCallback((purchaseId: string) => {
    if (pollRef.current) return;
    pollRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/checkout/sepay?id=${purchaseId}`);
        const data: ApiResponse<PurchaseStatus> = await response.json();

        if (data.success && data.data) {
          if (data.data.status === "COMPLETED") {
            setState({ step: "success" });
            stopPolling();
          } else if (data.data.status === "EXPIRED" || data.data.status === "REFUNDED") {
            setState({ step: "expired" });
            stopPolling();
          }
        }
      } catch {
        // Silently continue polling on network errors
      }
    }, POLL_INTERVAL);
  }, []);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopPolling();
  }, []);

  // Loading state
  if (state.step === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Generating payment...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (state.step === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-elevated">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-6 text-destructive" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">Payment Error</h2>
          <p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (state.step === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-elevated">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <Check className="size-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-foreground">
            Thanh toán thành công!
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Cảm ơn bạn đã mua {product.name}. Bạn đã có quyền truy cập vào source code.
          </p>
          <button
            onClick={() => router.push("/dashboard?billing=success")}
            className="shine-effect mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Expired state
  if (state.step === "expired") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-elevated">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Clock className="size-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Đã hết thời gian thanh toán
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Phiên thanh toán đã hết hạn. Vui lòng tạo giao dịch mới.
          </p>
          <button
            onClick={() => {
              setState({ step: "loading" });
              createPayment();
            }}
            className="shine-effect mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg"
          >
            Tạo thanh toán mới
          </button>
        </div>
      </div>
    );
  }

  // Payment state — main QR display
  const { data } = state;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Quay lại Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            Thanh toán qua <span className="text-gradient">VietQR</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quét mã QR hoặc chuyển khoản theo thông tin bên dưới
          </p>
        </div>

        {/* Main card */}
        <div className="border-gradient rounded-2xl border border-border bg-card shadow-elevated animate-pulse-glow">
          {/* Amount header */}
          <div className="border-b border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">Số tiền thanh toán</p>
            <p className="mt-1 text-3xl font-bold text-gradient">
              {formatVND(data.amount)} <span className="text-lg">VND</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {product.name} — One-time purchase
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center border-b border-border p-6">
            <div className="rounded-xl bg-white p-3 shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.qrUrl}
                alt="VietQR Payment Code"
                width={240}
                height={240}
                className="size-60"
              />
            </div>
          </div>

          {/* Bank details */}
          <div className="space-y-3 p-6">
            <div className="flex items-center justify-between rounded-lg bg-accent/30 px-4 py-3">
              <div className="flex items-center gap-3">
                <Building2 className="size-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Ngân hàng</p>
                  <p className="font-medium text-foreground">{data.bankCode}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-accent/30 px-4 py-3">
              <div className="flex items-center gap-3">
                <CreditCard className="size-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Số tài khoản</p>
                  <p className="font-mono font-medium text-foreground">{data.bankAccount}</p>
                </div>
              </div>
              <CopyButton text={data.bankAccount} label="account number" />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-accent/30 px-4 py-3">
              <div className="flex items-center gap-3">
                <QrCode className="size-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Số tiền</p>
                  <p className="font-mono font-medium text-foreground">{formatVND(data.amount)} VND</p>
                </div>
              </div>
              <CopyButton text={String(data.amount)} label="amount" />
            </div>

            <div className="flex items-center justify-between rounded-lg border-2 border-primary/20 bg-primary/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <FileText className="size-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Nội dung chuyển khoản</p>
                  <p className="font-mono text-lg font-bold text-primary">{data.paymentCode}</p>
                </div>
              </div>
              <CopyButton text={data.paymentCode} label="payment code" />
            </div>
          </div>

          {/* Footer */}
          <div className="space-y-3 border-t border-border px-6 py-4">
            <CountdownTimer expiresAt={data.expiresAt} />

            <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>
                Nhập đúng nội dung chuyển khoản <strong>{data.paymentCode}</strong> để được xác nhận tự động.
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              <span>Đang chờ xác nhận thanh toán...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
