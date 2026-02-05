"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            fontFamily: "system-ui, sans-serif",
            backgroundColor: "#f9fafb",
            color: "#111827",
          }}
        >
          <div
            style={{
              maxWidth: "28rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "4rem",
                height: "4rem",
                margin: "0 auto 1.5rem",
                borderRadius: "50%",
                backgroundColor: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              Critical Error
            </h1>

            <p
              style={{
                color: "#6b7280",
                marginBottom: "1.5rem",
              }}
            >
              A critical error occurred in the application. Please try refreshing the page.
            </p>

            {error.digest && (
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                  marginBottom: "1.5rem",
                }}
              >
                Error ID: {error.digest}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
              }}
            >
              <button
                onClick={reset}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#4f46e5",
                  color: "white",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Try again
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "white",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
