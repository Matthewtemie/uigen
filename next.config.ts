import type { NextConfig } from "next";

// Fix Node.js 25+ Web Storage SSR compatibility
if (typeof globalThis !== "undefined" && typeof window === "undefined") {
  delete globalThis.localStorage;
  delete globalThis.sessionStorage;
}

const nextConfig: NextConfig = {
  devIndicators: false,
};

export default nextConfig;