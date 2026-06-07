import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker build'i .next/standalone üretsin diye yalnızca Docker'da açılır
  // (Dockerfile builder aşamasında ENV DOCKER_BUILD=1). Vercel'de undefined kalır.
  output: process.env.DOCKER_BUILD ? "standalone" : undefined,
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
