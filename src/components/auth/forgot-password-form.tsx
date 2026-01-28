"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthCard } from "./auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth";
import { usePassword } from "@/hooks";

export function ForgotPasswordForm() {
  const { isLoading, uiError, success, requestReset, clear } = usePassword();

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

  async function onSubmit(values: ForgotPasswordInput) {
    clear();
    await requestReset(values.email);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const emailError = errors.email?.message ?? uiError?.fieldErrors?.email;

  return (
    <AuthCard title="Forgot password" description="We’ll email you a reset link.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isLoading}
            {...register("email")}
          />
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        </div>

        {uiError?.formError && <p className="text-sm text-red-500">{uiError.formError}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <div className="flex justify-between text-sm">
        <Link href="/sign-in" className="underline">
          Back to sign in
        </Link>
        <Link href="/sign-up" className="underline">
          Create account
        </Link>
      </div>
    </AuthCard>
  );
}
