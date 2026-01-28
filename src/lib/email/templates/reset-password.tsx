import * as React from "react";

export function ResetPasswordTemplate(props: { name?: string; url: string }) {
  return (
    <div style={{ fontFamily: "ui-sans-serif, system-ui", lineHeight: 1.5 }}>
      <h2>Reset your password</h2>
      <p>Hi {props.name ?? "there"},</p>
      <p>Click the button below to reset your password:</p>
      <p>
        <a
          href={props.url}
          style={{
            display: "inline-block",
            padding: "10px 14px",
            borderRadius: 8,
            textDecoration: "none",
            border: "1px solid #111",
          }}
        >
          Reset Password
        </a>
      </p>
      <p style={{ color: "#666", fontSize: 12 }}>
        This link may expire. If it does, request a new reset link.
      </p>
    </div>
  );
}
