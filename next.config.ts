import type { NextConfig } from "next";

// Exportación estática: Dokploy la sirve con nginx (ver Dockerfile)
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
