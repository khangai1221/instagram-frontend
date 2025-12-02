/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "source.unsplash.com",
      "static.vecteezy.com",
      "chatgpt.com",
      "images.unsplash.com",
      "unsplash.com",
      "ui-avatars.com",
      "plus.unsplash.com",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5500/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
