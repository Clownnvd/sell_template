"use client";

import { useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div>
      <h1>Reset password</h1>
      <p>Token: {token}</p>
      {/* form reset password */}
    </div>
  );
}
