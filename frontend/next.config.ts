import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",              // plain HTML/JS/CSS, no server needed
  trailingSlash: true,           // /projects/jouiha/ works on any static host
  images: { unoptimized: true }, // no image optimizer in static export
  
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;