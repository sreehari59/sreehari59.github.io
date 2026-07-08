import type { NextConfig } from "next";

// Static export served from GitHub Pages under /dev (the "developer" audience route).
// The site is fully client-rendered (VS Code–style IDE); chat talks to the external
// Cloudflare Worker via NEXT_PUBLIC_CHAT_URL, so there is no server runtime here.
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/dev",
  trailingSlash: true,
  images: { unoptimized: true },
  transpilePackages: ["@portfolio/content"],
};

export default nextConfig;
