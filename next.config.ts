import type { NextConfig } from "next";

// Served at the root of https://nailaid.nordchiou.com, so the base path is empty.
// Set NEXT_PUBLIC_BASE_PATH=/<repo> only if the site ever moves back under <user>.github.io/<repo>.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
