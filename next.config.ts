import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.blob.vercel-storage.com" },
    ],
  },
  async rewrites() {
    const amg = process.env.NEXT_PUBLIC_AMG_VIDEO_URL?.trim();
    return [
      { source: "/logo.png", destination: "/logo-white.png" },
      ...(amg
        ? [{ source: "/works/advance-motion-graphics.mp4", destination: amg }]
        : []),
    ];
  },
};

export default nextConfig;
