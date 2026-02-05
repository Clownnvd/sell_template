// middleware.ts
// Security: This middleware handles route-level protection using cookie detection.
// Actual session verification happens in API routes via requireAuth().
// Two-layer approach:
// 1. Middleware (Edge): Fast cookie check for page-level redirects + security headers
// 2. API routes (Node): Full session verification with database lookup
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/settings", "/billing"];
// Auth routes - uncomment if you want to redirect logged-in users away from these
// const authRoutes = ["/sign-in", "/sign-up", "/forgot-password", "/reset-password"];

// Security headers to apply to all responses
const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-XSS-Protection": "1; mode=block",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com; frame-src https://js.stripe.com https://www.youtube.com;",
};

function isRouteMatch(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

function isAuthenticatedByCookies(req: NextRequest) {
  // BetterAuth uses "better-auth.session_token" as the session cookie
  const sessionToken = req.cookies.get("better-auth.session_token");

  // Check if session token exists and has a valid value
  if (sessionToken?.value && sessionToken.value.length > 20) {
    return true;
  }

  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((r) => isRouteMatch(pathname, r));
  const isAuthenticated = isAuthenticatedByCookies(request);

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/sign-in";
    loginUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(loginUrl);
    applySecurityHeaders(response);
    return response;
  }

  // Option: Redirect logged-in users away from auth pages
  // Uncomment if you want this behavior (most SaaS do this)
  // if (isAuthRoute && isAuthenticated) {
  //   const dashboardUrl = request.nextUrl.clone();
  //   dashboardUrl.pathname = "/dashboard";
  //   dashboardUrl.search = "";
  //   const response = NextResponse.redirect(dashboardUrl);
  //   applySecurityHeaders(response);
  //   return response;
  // }

  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

function applySecurityHeaders(response: NextResponse) {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
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
