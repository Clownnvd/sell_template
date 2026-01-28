"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signInSchema, type SignInInput } from "@/lib/validations/auth";
import { useAuth } from "@/hooks";
import { AuthCard } from "./auth-card";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, uiError, signIn, clearError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const callbackUrl = useMemo(() => {
    const cb = searchParams.get("callbackUrl");
    // Basic safety: prevent weird full URLs / open redirects
    if (!cb) return "/dashboard";
    if (!cb.startsWith("/")) return "/dashboard";
    return cb;
  }, [searchParams]);

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const emailError = errors.email?.message ?? uiError?.fieldErrors?.email;
  const passwordError = errors.password?.message ?? uiError?.fieldErrors?.password;

  async function onSubmit(values: SignInInput) {
    clearError();
    const res = await signIn(values);

    if (res.ok) {
      // replace để user bấm back không quay lại trang sign-in
      router.replace(callbackUrl);
      router.refresh();
    }
  }

  return (
    <AuthCard title="Sign in" description="Welcome back. Enter your email and password.">
      {/* Form-level error */}
      {uiError?.formError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {uiError.formError}
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isLoading}
            aria-invalid={!!emailError}
            {...register("email")}
          />
          {emailError ? (
            <p className="text-xs text-red-500">{emailError}</p>
          ) : (
            <p className="text-xs text-muted-foreground">Use the email you signed up with.</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs underline underline-offset-4">
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              autoComplete="current-password"
              disabled={isLoading}
              aria-invalid={!!passwordError}
              className="pr-16"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isLoading}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {passwordError ? <p className="text-xs text-red-500">{passwordError}</p> : null}
        </div>

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline underline-offset-4">
            Create account
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
