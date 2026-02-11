const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  // Externalize Prisma from server bundle for smaller output
  serverExternalPackages: ["@prisma/client"],
  experimental: {},
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Vary", value: "Cookie" },
        ],
      },
      // Webhook responses must never be cached by proxies
      {
        source: "/api/webhooks/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      // CDN-friendly stale-while-revalidate for landing page
      {
        source: "/",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=300" },
        ],
      },
      // CDN-friendly immutable cache for static assets
      {
        source: "/:path*\\.(jpg|jpeg|png|gif|webp|svg|ico|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
