import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "source.unsplash.com",
      "static.vecteezy.com",
      "chatgpt.com",
      "images.unsplash.com",
      "localhost:3001/_next/",
    ],
  },
};

export default nextConfig;
