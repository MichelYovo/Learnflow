import path from "node:path";
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://accounts.google.com https://*.google.com",
      "frame-src 'self' https://accounts.google.com https://*.google.com https://*.supabase.co",
      "base-uri 'self'",
      "form-action 'self' https://accounts.google.com https://*.supabase.co",
      "object-src 'none'",
      ...(isProd ? ["upgrade-insecure-requests"] : []),
    ].join("; "),
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  ...(isProd
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
