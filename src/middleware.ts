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

// Security headers to apply to all responses
const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-XSS-Protection": "1; mode=block",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com; frame-src https://js.stripe.com https://www.youtube.com;",
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
    loginUrl.searchParams.set("callbackUrl", pathname);
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
