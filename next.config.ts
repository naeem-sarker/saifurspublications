import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

export default nextConfig;
