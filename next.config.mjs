// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set basePath from NEXT_PUBLIC_BASE_URL environment variable
  // Falls back to production default '/zhihu2025' if not set
  // Note: NEXT_PUBLIC_* variables are available in both server and client
  basePath: process.env.NEXT_PUBLIC_BASE_URL || "",
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
          source: "/app/:path*",
          destination: "https://api.zhihu.com/:path*",
        },
        {
          source: "/api/:path*",
          destination: "https://api.zhihu.com/api/:path*",
        },
        {
          source: "/zvideos/:path*",
          destination: "https://api.zhihu.com/zvideos/:path*",
        },
        {
          source: "/chat/:path*",
          destination: "https://event.zhihu.com/api/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
