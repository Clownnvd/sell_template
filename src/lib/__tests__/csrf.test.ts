import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { verifyCsrf } from "@/lib/csrf";

const APP_URL = "http://localhost:3000";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_APP_URL", APP_URL);
});

describe("verifyCsrf", () => {
  it("allows GET requests without origin", () => {
    const req = new NextRequest("http://localhost:3000/api/test", {
      method: "GET",
    });
    expect(verifyCsrf(req)).toBeNull();
  });

  it("allows POST with valid Origin header", () => {
    const req = new NextRequest("http://localhost:3000/api/test", {
      method: "POST",
      headers: { origin: APP_URL },
    });
    expect(verifyCsrf(req)).toBeNull();
  });

  it("rejects POST with wrong Origin header", async () => {
    const req = new NextRequest("http://localhost:3000/api/test", {
      method: "POST",
      headers: { origin: "http://evil.com" },
    });
    const result = verifyCsrf(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(403);

    const data = await result!.json();
    expect(data.code).toBe("FORBIDDEN");
  });

  it("allows POST with valid Referer when Origin is missing", () => {
    const req = new NextRequest("http://localhost:3000/api/test", {
      method: "POST",
      headers: { referer: `${APP_URL}/dashboard` },
    });
    expect(verifyCsrf(req)).toBeNull();
  });

  it("rejects POST when both Origin and Referer are missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/test", {
      method: "POST",
    });
    const result = verifyCsrf(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(403);

    const data = await result!.json();
    expect(data.code).toBe("FORBIDDEN");
  });

  it("rejects PATCH with wrong Referer", async () => {
    const req = new NextRequest("http://localhost:3000/api/test", {
      method: "PATCH",
      headers: { referer: "http://evil.com/page" },
    });
    const result = verifyCsrf(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(403);
  });
});
