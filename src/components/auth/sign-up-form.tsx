"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signUpSchema, type SignUpInput } from "@/lib/validations/auth";
import { useAuth } from "@/hooks";
import { AuthCard } from "./auth-card";

export function SignUpForm() {
  const router = useRouter();
  const { isLoading, uiError, signUp, clearError } = useAuth();

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

  async function onSubmit(values: SignUpInput) {
    clearError();
    const res = await signUp(values);
    if (res.ok) router.push("/dashboard");
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const nameError = errors.name?.message ?? uiError?.fieldErrors?.name;
  const emailError = errors.email?.message ?? uiError?.fieldErrors?.email;
  const passwordError = errors.password?.message ?? uiError?.fieldErrors?.password;
  const confirmPasswordError =
    errors.confirmPassword?.message ?? uiError?.fieldErrors?.confirmPassword;

  return (
    <AuthCard title="Create account" description="Create your account to get started.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Your name"
            autoComplete="name"
            disabled={isLoading}
            {...register("name")}
          />
          {nameError && <p className="text-sm text-red-500">{nameError}</p>}
        </div>

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
            autoComplete="new-password"
            disabled={isLoading}
            {...register("password")}
          />
          {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="********"
            autoComplete="new-password"
            disabled={isLoading}
            {...register("confirmPassword")}
          />
          {confirmPasswordError && (
            <p className="text-sm text-red-500">{confirmPasswordError}</p>
          )}
        </div>

        {uiError?.formError && <p className="text-sm text-red-500">{uiError.formError}</p>}

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create account"}
        </Button>
      </form>

      <div className="text-sm">
        Already have an account?{" "}
        <Link href="/sign-in" className="underline">
          Sign in
        </Link>
      </div>
    </AuthCard>
  );
}
