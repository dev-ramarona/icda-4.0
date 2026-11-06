import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [process.env.JWT_ACCESS_SECRET ?? "http://localhost:3003"],
};

export default nextConfig;
