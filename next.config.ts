import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Output standalone pour Docker
  output: "standalone",

  images: {
    domains: [
      "localhost",
      "127.0.0.1",
      "sso.skygenesisenterprise.net",
      "sso.skygenesisenterprise.com",
    ],  
    unoptimized: false,
  },

  async rewrites() {
    const isDevelopment = process.env.NODE_ENV === "development";
    const isProduction = process.env.NODE_ENV === "production";

    // Détermination automatique du backend URL
    let backendUrl: string = process.env.BACKEND_URL || (isProduction ? "http://backend:8080" : "http://localhost:8080");

    // Validation
    try {
      new URL(backendUrl);
    } catch (err) {
      console.error("❌ Backend URL invalide :", backendUrl, err);
      backendUrl = isDevelopment ? "http://localhost:8080" : "http://backend:8080";
    }

    return [
      // Proxy API v1
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },

      // Health check
      {
        source: "/health",
        destination: `${backendUrl}/health`,
      },

      // Proxy OIDC well-known endpoints
      {
        source: "/.well-known/:path*",
        destination: `${backendUrl}/.well-known/:path*`,
      },

      // Proxy fallback pour toutes les autres routes API
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },

  async headers() {
    const isProduction = process.env.NODE_ENV === "production";

    const baseHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "origin-when-cross-origin" },
      { key: "X-XSS-Protection", value: "1; mode=block" },
    ];

    if (isProduction) {
      baseHeaders.push(
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
      );
    } else {
      baseHeaders.push({ key: "X-Frame-Options", value: "SAMEORIGIN" });
    }

    return [
      {
        source: "/(.*)",
        headers: baseHeaders,
      },
    ];
  },
};

export default nextConfig;