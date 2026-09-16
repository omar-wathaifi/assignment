import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the trace root to this project: an unrelated lockfile higher up the
  // filesystem would otherwise be inferred as the workspace root.
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  images: {
    // Photos proxied through /api/photos are served from Unsplash's CDN.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    // The only SVGs rendered are the local placeholder covers in public/images.
    // The sandbox CSP below keeps them inert.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
