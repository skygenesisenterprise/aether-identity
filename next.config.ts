import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Remove X-Powered-By header for security
  poweredByHeader: false,

  // Standalone output for containerized deployments
  output: 'standalone',

  // Image optimization settings
  images: {
    // Add domains if using external images
    domains: [],
    // Enable image optimization
    unoptimized: false,
  },

  // Turbopack configuration
  turbopack: {
    root: process.cwd(),
  },

  // Path aliases for clean imports
  webpack: (config, { isServer }) => {
    // Add any custom webpack config here if needed
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "./app"),
      "@api": path.resolve(__dirname, "./api"),
    };

    // Exclude API folder from client-side bundle
    if (!isServer) {
      config.externals = {
        ...config.externals,
        '@prisma/client': 'commonjs @prisma/client',
      };
    }

    // Exclude API folder from compilation
    config.externals = {
      ...config.externals,
      './api/config/database.ts': 'commonjs ./api/config/database.ts',
      './api/models/accountModels.ts': 'commonjs ./api/models/accountModels.ts',
      './api/services/accountServices.ts': 'commonjs ./api/services/accountServices.ts',
      './api/controllers/accountControllers.ts': 'commonjs ./api/controllers/accountControllers.ts',
      './api/middlewares/accountMiddlewares.ts': 'commonjs ./api/middlewares/accountMiddlewares.ts',
      './api/routes/account.Routes.ts': 'commonjs ./api/routes/account.Routes.ts',
      './api/controllers/cmsControllers.ts': 'commonjs ./api/controllers/cmsControllers.ts',
      './api/routes/cms.Routes.ts': 'commonjs ./api/routes/cms.Routes.ts',
      './api/utils/logger.ts': 'commonjs ./api/utils/logger.ts',
      './api/server.ts': 'commonjs ./api/server.ts',
    };

    return config;
  },

  // Exclude API folder from TypeScript compilation
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },


};

export default nextConfig;