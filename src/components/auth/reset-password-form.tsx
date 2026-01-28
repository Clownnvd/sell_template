"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthCard } from "./auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";
import { usePassword } from "@/hooks";

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = (params.get("token") ?? "").trim();

  const { isLoading, uiError, success, clear, resetWithToken } = usePassword();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onSubmit",
  });

  async function onSubmit(values: ResetPasswordInput) {
    clear();

    if (!token) return;

    const res = await resetWithToken({ token, newPassword: values.newPassword });
    if (res.ok) router.push("/sign-in?reset=1");
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const tokenMissing = !token;

  const newPasswordError =
    errors.newPassword?.message ??
    uiError?.fieldErrors?.newPassword ??
    uiError?.fieldErrors?.password;

  const confirmPasswordError =
    errors.confirmPassword?.message ?? uiError?.fieldErrors?.confirmPassword;

  return (
    <AuthCard title="Reset password" description="Set a new password for your account.">
      {tokenMissing ? (
        <div className="space-y-3">
          <p className="text-sm text-red-500">
            This reset link is invalid or missing. Please request a new one.
          </p>
          <div className="flex gap-3 text-sm">
            <Link className="underline" href="/forgot-password">
              Request new link
            </Link>
            <Link className="underline" href="/sign-in">
              Back to sign in
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="********"
              disabled={isLoading}
              {...register("newPassword")}
            />
            {newPasswordError && <p className="text-sm text-red-500">{newPasswordError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="********"
              disabled={isLoading}
              {...register("confirmPassword")}
            />
            {confirmPasswordError && (
              <p className="text-sm text-red-500">{confirmPasswordError}</p>
            )}
          </div>

          {uiError?.formError && <p className="text-sm text-red-500">{uiError.formError}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update password"}
          </Button>

          <div className="flex justify-between text-sm">
            <Link className="underline" href="/forgot-password">
              Request new link
            </Link>
            <Link className="underline" href="/sign-in">
              Back to sign in
            </Link>
          </div>
        </form>
      )}
    </AuthCard>
  );
}
