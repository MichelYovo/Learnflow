import path from "node:path";
import type { NextConfig } from "next";

const dir = path.join(__dirname);

const nextConfig: NextConfig = {
  // Plusieurs lockfiles (repo + admin) : forcer la racine sinon Turbopack
  // enregistre /dashboard mais 404 sur /dashboard/eleves, /api/super-prof, etc.
  outputFileTracingRoot: dir,
  turbopack: {
    root: dir,
  },
};

export default nextConfig;
