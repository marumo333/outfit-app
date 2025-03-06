import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tkkavdiinrmmeeghllrr.supabase.co",
        pathname: "/storage/v1/object/public/**", // Supabase ストレージの公開パス
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
