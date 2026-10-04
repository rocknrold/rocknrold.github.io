import type { NextConfig } from "next";

// Exported as static files and served by GitHub Pages from the `master` branch.
// See .github/workflows/deploy.yml.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
