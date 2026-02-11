// proxy.ts
// Security: This proxy handles route-level protection using cookie detection.
// Actual session verification happens in API routes via requireAuth().
// Two-layer approach:
// 1. Proxy (Node): Fast cookie check for page-level redirects + security headers
// 2. API routes (Node): Full session verification with database lookup
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/settings", "/billing"];
// Auth routes - uncomment if you want to redirect logged-in users away from these
// const authRoutes = ["/sign-in", "/sign-up", "/forgot-password", "/reset-password"];

function getAllowedOrigin(requestOrigin: string | null): string | null {
  if (!requestOrigin) return null;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return null;
  try {
    const allowed = new URL(appUrl).origin;
    return requestOrigin === allowed ? allowed : null;
  } catch {
    return null;
  }
}

// Security headers applied to ALL responses
const securityHeaders: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-XSS-Protection": "1; mode=block",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com; frame-src https://js.stripe.com https://www.youtube.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests; report-uri /api/csp-report; report-to csp-endpoint;",
  "Reporting-Endpoints": 'csp-endpoint="/api/csp-report"',
};

// HSTS only in production (avoid locking localhost to HTTPS)
if (process.env.NODE_ENV === "production") {
  securityHeaders["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload";
}

function isRouteMatch(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

function isAuthenticatedByCookies(req: NextRequest) {
  // Cookie name depends on prefix config in auth.ts
  // With cookiePrefix: "king", the cookie is "king.session_token"
  // Falls back to default "better-auth.session_token" if prefix not set
  const sessionToken =
    req.cookies.get("king.session_token") ??
    req.cookies.get("better-auth.session_token");

  if (sessionToken?.value && sessionToken.value.length > 20) {
    return true;
  }

  return false;
}

function isValidCallbackUrl(url: string): boolean {
  // Block open redirect attacks
  if (url.startsWith("//") || url.startsWith("/\\")) return false;
  if (!url.startsWith("/")) return false;
  try {
    new URL(url, "http://localhost");
    return true;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

  // CORS: Handle preflight OPTIONS requests for API routes
  const isApiRoute = pathname.startsWith("/api/");
  const origin = request.headers.get("origin");
  const allowedOrigin = getAllowedOrigin(origin);

  if (isApiRoute && request.method === "OPTIONS") {
    const preflightResponse = new NextResponse(null, { status: 204 });
    if (allowedOrigin) {
      preflightResponse.headers.set("Access-Control-Allow-Origin", allowedOrigin);
      preflightResponse.headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
      preflightResponse.headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With");
      preflightResponse.headers.set("Access-Control-Max-Age", "86400");
    }
    preflightResponse.headers.set("X-Request-Id", requestId);
    return preflightResponse;
  }

  const isProtectedRoute = protectedRoutes.some((r) => isRouteMatch(pathname, r));
  const isAuthenticated = isAuthenticatedByCookies(request);

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/sign-in";
    if (isValidCallbackUrl(pathname)) {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    const response = NextResponse.redirect(loginUrl);
    response.headers.set("X-Request-Id", requestId);
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

  const response = NextResponse.next({
    request: {
      headers: new Headers({
        ...Object.fromEntries(request.headers),
        "x-request-id": requestId,
      }),
    },
  });
  response.headers.set("X-Request-Id", requestId);
  applySecurityHeaders(response);

  // CORS: Set Access-Control-Allow-Origin on API responses
  if (isApiRoute && allowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  }

  return response;
}

function applySecurityHeaders(response: NextResponse) {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
