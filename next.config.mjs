// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "",
  output: "export", // ← Enables next export (pure static)
  trailingSlash: true, // Recommended for static hosting
  images: {
    unoptimized: true, // Required for static export (no next/image loader)
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Rewrites work in development mode (next dev) but NOT in static export
  // In production, use direct API URLs via environment variables
  rewrites: async () => {
    // Only enable rewrites in development mode
    // In production build, rewrites are ignored (static export has no server)
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/auth/me",
          destination: "https://www.zhihu.com/api/v4/me",
        },
        {
          source: "/api/:path*",
          destination: "https://api.zhihu.com/api/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
