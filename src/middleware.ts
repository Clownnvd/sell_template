// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/settings", "/billing"];
const authRoutes = ["/sign-in", "/sign-up", "/forgot-password", "/reset-password"];

function isRouteMatch(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

function isAuthenticatedByCookies(req: NextRequest) {
  const cookies = req.cookies.getAll();

  // ✅ Pattern-based detection: không cần biết chính xác cookie name
  return cookies.some((c) => {
    const name = c.name.toLowerCase();

    // BetterAuth/Auth.js/NextAuth + common session naming
    if (name.includes("better-auth")) return true;
    if (name.includes("authjs")) return true;
    if (name.includes("next-auth")) return true;

    // fallback cho app tự đặt
    if (name.includes("session")) return true;
    if (name.includes("token")) return true;

    return false;
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((r) => isRouteMatch(pathname, r));
  const isAuthRoute = authRoutes.some((r) => isRouteMatch(pathname, r));

  const isAuthenticated = isAuthenticatedByCookies(request);

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/sign-in";
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/billing/:path*",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
  ],
};
