/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // enable static export
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
};

module.exports = nextConfig; // Use CommonJS export
