import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [process.env.BACKEND_DOMAIN ?? "http://localhost:8083"],
};

export default nextConfig;
