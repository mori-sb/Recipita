import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export", // ← これを追加！
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
