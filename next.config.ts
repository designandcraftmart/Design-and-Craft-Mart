import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Product photos will live in Supabase Storage.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  async redirects() {
    return [
      // /shop was renamed to /products. ":path*" also matches "/shop" itself.
      { source: "/shop/:path*", destination: "/products/:path*", permanent: true },
      {
        source: "/:lang(en|bn)/shop/:path*",
        destination: "/:lang/products/:path*",
        permanent: true,
      },
    ];
  },
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