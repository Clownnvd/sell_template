"use client";

import Link from "next/link";
import { useState, useCallback, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButtons, OAuthDivider } from "@/components/auth/oauth-buttons";

import { signUpSchema, type SignUpInput } from "@/lib/validations/auth";
import { useAuth } from "@/hooks";
import { AuthCard } from "./auth-card";

export function SignUpForm() {
  const t = useTranslations("auth.signUp");
  const tAuth = useTranslations("auth");
  const {
    isPending,
    uiError,
    signUp,
    clearError,
    preloadDashboard,
    navigateAfterAuth,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, startNavigation] = useTransition();

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const isLoading = isSubmitting || isPending || isNavigating;

  const nameError = errors.name?.message ?? uiError?.fieldErrors?.name;
  const emailError = errors.email?.message ?? uiError?.fieldErrors?.email;
  const passwordError = errors.password?.message ?? uiError?.fieldErrors?.password;
  const confirmPasswordError =
    errors.confirmPassword?.message ?? uiError?.fieldErrors?.confirmPassword;

  const handleFormFocus = useCallback(() => {
    preloadDashboard();
  }, [preloadDashboard]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback(
    async (values: SignUpInput) => {
      clearError();
      setIsSubmitting(true);

      try {
        const res = await signUp(values);

        if (res.ok) {
          startNavigation(() => {
            navigateAfterAuth("/dashboard");
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [signUp, clearError, navigateAfterAuth]
  );

  return (
    <AuthCard title={t("title")} description={t("description")}>
      {/* OAuth Buttons */}
      <OAuthButtons mode="signup" disabled={isLoading} callbackUrl="/dashboard" />

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
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")}</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              placeholder={t("namePlaceholder")}
              autoComplete="name"
              disabled={isLoading}
              aria-invalid={nameError ? true : undefined}
              aria-describedby={nameError ? "name-error" : undefined}
              className="h-12 pl-10"
              {...register("name")}
            />
          </div>
          {nameError ? (
            <p id="name-error" className="animate-in fade-in text-sm text-destructive">
              {nameError}
            </p>
          ) : null}
        </div>

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
          <Label htmlFor="password">{t("password")}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("passwordPlaceholder")}
              autoComplete="new-password"
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

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("confirmPasswordPlaceholder")}
              autoComplete="new-password"
              disabled={isLoading}
              aria-invalid={confirmPasswordError ? true : undefined}
              aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
              className="h-12 pl-10 pr-12"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              aria-label={showConfirmPassword ? tAuth("hidePassword") : tAuth("showPassword")}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {confirmPasswordError ? (
            <p id="confirm-password-error" className="animate-in fade-in text-sm text-destructive">
              {confirmPasswordError}
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

        <p className="text-center text-xs text-muted-foreground">
          {t("terms")}{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            {t("termsLink")}
          </Link>{" "}
          &{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            {t("privacyLink")}
          </Link>
        </p>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("hasAccount")}
          </span>
        </div>
      </div>

      {/* Sign in link */}
      <div className="text-center">
        <Link
          href="/sign-in"
          className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-border bg-background text-base font-medium shadow-subtle transition-all hover:bg-muted hover:shadow-card focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          prefetch={true}
        >
          {t("signIn")}
        </Link>
      </div>
    </AuthCard>
  );
}
