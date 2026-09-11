const DEFAULT_ORIGINS = [
  "http://localhost:3002",
  "http://127.0.0.1:3002",
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "https://learnflow-web.vercel.app",
];

function hostFromEnv(value?: string) {
  if (!value?.trim()) return "";
  return value.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function vercelOrigins() {
  return [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_BRANCH_URL]
    .map(hostFromEnv)
    .filter(Boolean)
    .map((host) => `https://${host}`);
}

function allowedOrigins() {
  const extra = (process.env.AUTH_CORS_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim().replace(/\/$/, ""))
    .filter(Boolean);
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().replace(/\/$/, "");
  return new Set([...DEFAULT_ORIGINS, ...extra, site, ...vercelOrigins()].filter(Boolean));
}

function isAllowedOrigin(origin: string) {
  const normalized = origin.replace(/\/$/, "");
  if (allowedOrigins().has(normalized)) return true;
  try {
    const url = new URL(normalized);
    if (url.protocol !== "https:") return false;
    return url.hostname.endsWith(".vercel.app") && /learnflow/i.test(url.hostname);
  } catch {
    return false;
  }
}

/** CORS strict : origines listées + previews Vercel LearnFlow. Les apps natives (sans Origin) passent. */
export function corsHeaders(request: Request): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  const origin = request.headers.get("origin");
  if (!origin) return headers;
  if (isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin.replace(/\/$/, "");
  }
  return headers;
}
