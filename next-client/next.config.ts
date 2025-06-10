import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export", // 静的出力に必要
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // ← これを追加！
  },
};

export default nextConfig;
