import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Required for Docker standalone output
  output: "standalone",

  images: {
    domains: [],
    unoptimized: false,
  },

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 
                     (process.env.NODE_ENV === 'production' 
                       ? process.env.API_BASE_URL || 'http://backend:8080'
                       : 'http://localhost:8080');
    
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
