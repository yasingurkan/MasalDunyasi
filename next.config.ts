import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker (Dockerfile runner aşaması) .next/standalone bekler.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
