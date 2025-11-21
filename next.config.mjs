// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",                  // ← Enables next export (pure static)
  trailingSlash: true,               // Recommended for static hosting
  images: {
    unoptimized: true,               // Required for static export (no next/image loader)
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Optional: if you deploy under a subpath
  // basePath: "/my-design-system",
  // assetPrefix: "/my-design-system/",
};

export default nextConfig;