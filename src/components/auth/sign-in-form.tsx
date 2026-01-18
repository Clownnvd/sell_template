"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signInSchema, type SignInInput } from "@/lib/validators/auth";
import { useAuthStore } from "@/stores/auth-store";
import { AuthCard } from "./auth-card";

export function SignInForm() {
  const router = useRouter();
  const { isLoading, uiError, signIn, clearError } = useAuthStore();

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  async function onSubmit(values: SignInInput) {
    clearError();
    const res = await signIn(values);
    if (res.ok) router.push("/app");
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const emailError = errors.email?.message ?? uiError?.fieldErrors?.email;
  const passwordError = errors.password?.message ?? uiError?.fieldErrors?.password;

  return (
    <AuthCard
      title="Sign in"
      description="Welcome back. Enter your email and password."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isLoading}
            {...register("email")}
          />
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            autoComplete="current-password"
            disabled={isLoading}
            {...register("password")}
          />
          {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
        </div>

        {uiError?.formError && <p className="text-sm text-red-500">{uiError.formError}</p>}

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="flex justify-between text-sm">
        <Link href="/forgot-password" className="underline">
          Forgot password?
        </Link>
        <Link href="/sign-up" className="underline">
          Create account
        </Link>
      </div>
    </AuthCard>
  );
}
