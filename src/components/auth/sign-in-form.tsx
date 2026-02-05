"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useCallback, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButtons, OAuthDivider } from "@/components/auth/oauth-buttons";

import { signInSchema, type SignInInput } from "@/lib/validations/auth";
import { useAuth } from "@/hooks";
import { AuthCard } from "./auth-card";

export function SignInForm() {
  const t = useTranslations("auth.signIn");
  const tAuth = useTranslations("auth");
  const searchParams = useSearchParams();
  const {
    isPending,
    uiError,
    signIn,
    clearError,
    preloadDashboard,
    navigateAfterAuth,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, startNavigation] = useTransition();

  const callbackUrl = (() => {
    const cb = searchParams.get("callbackUrl");
    if (!cb || !cb.startsWith("/")) return "/dashboard";
    return cb;
  })();

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

  const isLoading = isSubmitting || isPending || isNavigating;

  const emailError = errors.email?.message ?? uiError?.fieldErrors?.email;
  const passwordError = errors.password?.message ?? uiError?.fieldErrors?.password;

  const handleFormFocus = useCallback(() => {
    preloadDashboard();
  }, [preloadDashboard]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback(
    async (values: SignInInput) => {
      clearError();
      setIsSubmitting(true);

      try {
        const res = await signIn(values);

        if (res.ok) {
          startNavigation(() => {
            navigateAfterAuth(callbackUrl);
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [signIn, clearError, callbackUrl, navigateAfterAuth]
  );

  return (
    <AuthCard title={t("title")} description={t("description")}>
      {/* OAuth Buttons */}
      <OAuthButtons mode="signin" disabled={isLoading} callbackUrl={callbackUrl} />

      {/* Divider */}
      <OAuthDivider />

      {uiError?.formError ? (
        <div className="animate-in fade-in slide-in-from-top-2 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive dark:border-destructive/30 dark:bg-destructive/10">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">{t("error.title")}</p>
            <p className="mt-1 opacity-90">{uiError.formError}</p>
          </div>
        </div>
      ) : null}

      {isNavigating ? (
        <div className="animate-in fade-in flex items-center justify-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-sm text-green-600 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{t("redirecting")}</span>
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit(onSubmit)}
        onFocus={handleFormFocus}
        className="space-y-5"
      >
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              autoComplete="email"
              disabled={isLoading}
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? "email-error" : undefined}
              className="h-12 pl-10"
              {...register("email")}
            />
          </div>
          {emailError ? (
            <p id="email-error" className="animate-in fade-in text-sm text-destructive">
              {emailError}
            </p>
          ) : null}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("password")}</Label>
            <Link
              href="/forgot-password"
              className="rounded-md px-1 py-0.5 text-sm font-medium text-primary transition-colors hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              tabIndex={isLoading ? -1 : 0}
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("passwordPlaceholder")}
              autoComplete="current-password"
              disabled={isLoading}
              aria-invalid={passwordError ? true : undefined}
              aria-describedby={passwordError ? "password-error" : undefined}
              className="h-12 pl-10 pr-12"
              {...register("password")}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              aria-label={showPassword ? tAuth("hidePassword") : tAuth("showPassword")}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {passwordError ? (
            <p id="password-error" className="animate-in fade-in text-sm text-destructive">
              {passwordError}
            </p>
          ) : null}
        </div>

        <Button
          className="group h-12 w-full text-base shadow-md hover:shadow-lg"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              {isNavigating ? t("redirecting") : t("submitting")}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {t("submit")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </form>

      {/* Bottom divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("noAccount")}
          </span>
        </div>
      </div>

      {/* Sign up link */}
      <div className="text-center">
        <Link
          href="/sign-up"
          className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-border bg-background text-base font-medium shadow-subtle transition-all hover:bg-muted hover:shadow-card focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          prefetch={true}
        >
          {t("createAccount")}
        </Link>
      </div>
    </AuthCard>
  );
}
