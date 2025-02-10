/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "tkkavdiinrmmeeghllrr.supabase.co",
          pathname: "/storage/v1/object/public/**", // Supabase ストレージの公開パス
        },
      ],
    },
  };
  
  module.exports = nextConfig;
  
  