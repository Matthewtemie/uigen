import type { NextConfig } from "next";

// Fix Node.js 25+ Web Storage SSR compatibility
if (typeof globalThis !== "undefined" && typeof window === "undefined") {
  (globalThis as Record<string, unknown>).localStorage = undefined;
  (globalThis as Record<string, unknown>).sessionStorage = undefined;
}

const nextConfig: NextConfig = {
  devIndicators: false,
};

export default nextConfig;