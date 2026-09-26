import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 82],
    // All photography is stored locally in /public/images (see CREDITS.json),
    // so no remote image domains are required. If you switch to a remote
    // image host, add it here via `remotePatterns`.
  },
};

export default nextConfig;
