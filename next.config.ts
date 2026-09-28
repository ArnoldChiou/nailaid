import type { NextConfig } from "next";

// GitHub Pages serves the site under /<repo>. CI sets NEXT_PUBLIC_BASE_PATH=/nailsafe;
// locally it is empty so `npm run dev` works at http://localhost:3000.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
