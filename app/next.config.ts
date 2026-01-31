import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  ...(isProduction && {
    output: "standalone",
  }),

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sso.skygenesisenterprise.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sso.skygenesisenterprise.net",
        pathname: "/**",
      },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
    ],
  },

  async headers() {
    const headers = [
      { key: "Referrer-Policy", value: "origin-when-cross-origin" },
    ];

    if (isProduction) {
      headers.push(
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
      );
    }

    return [{ source: "/(.*)", headers }];
  },
};

export default nextConfig;
