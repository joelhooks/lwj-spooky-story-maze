import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fal.media",
        port: "",
      },
    ],
  },
};

export default nextConfig;
