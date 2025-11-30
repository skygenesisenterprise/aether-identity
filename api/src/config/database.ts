import { PrismaClient } from '@prisma/client';

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Database provider detection
const databaseProvider = process.env.DATABASE_PROVIDER || (isProduction ? 'postgresql' : 'sqlite');

// Default configurations based on environment
const getDefaultDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  switch (databaseProvider) {
    case 'postgresql':
      return process.env.POSTGRES_URL || 'postgresql://postgres:password@localhost:5432/aether_identity';
    case 'sqlite':
    default:
      return isDevelopment ? 'file:./prisma/dev.db' : 'file:./data/dev.db';
  }
};

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    provider: databaseProvider,
    url: getDefaultDatabaseUrl(),
    ssl: databaseProvider === 'postgresql' ? process.env.POSTGRES_SSL === 'true' : false,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as string,
  },
  cors: {
    origin: process.env.API_CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  // Database-specific settings
  databaseSettings: {
    connectionTimeout: 30000,
    queryTimeout: 10000,
    logQueries: isDevelopment,
    logLevel: process.env.LOG_LEVEL || (isDevelopment ? 'info' : 'warn'),
  }
};

// Enhanced Prisma client with environment-specific configuration
const createPrismaClient = () => {
  try {
    const clientOptions: any = {
      datasources: {
        db: {
          url: config.database.url,
        },
      },
      log: isDevelopment ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
    };

    // Add PostgreSQL-specific options
    if (config.database.provider === 'postgresql') {
      clientOptions.__internal = {
        engine: {
          connectionTimeout: config.databaseSettings.connectionTimeout,
        },
      };
    }

    return new PrismaClient(clientOptions);
  } catch (error) {
    console.error('❌ Error creating Prisma client:', error);
    // Fallback for build environment
    return {} as any;
  }
};

// Singleton pattern for Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (isDevelopment) {
  globalForPrisma.prisma = prisma;
}

export { PrismaClient };

// Enhanced database connection with health check
export const connectDatabase = async (): Promise<void> => {
  try {
    console.log(`🔌 Connecting to ${config.database.provider} database...`);
    console.log(`📍 Database URL: ${config.database.url.replace(/\/\/.*@/, '//***:***@')}`);
    
    await prisma.$connect();
    
    // Test connection with a simple query
    await prisma.$queryRaw`SELECT 1`;
    
    console.log(`✅ ${config.database.provider.toUpperCase()} database connected successfully`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
  } catch (error) {
    console.error(`❌ Database connection failed (${config.database.provider}):`, error);
    
    if (isProduction) {
      console.error('🚨 Production database connection failed - exiting');
      process.exit(1);
    } else {
      console.error('⚠️ Development database connection failed - continuing with limited functionality');
    }
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
  }
};

// Database health check
export const checkDatabaseHealth = async (): Promise<{
  status: 'healthy' | 'unhealthy';
  provider: string;
  connected: boolean;
  error?: string;
  responseTime?: number;
}> => {
  const startTime = Date.now();
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      provider: config.database.provider,
      connected: true,
      responseTime,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      provider: config.database.provider,
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime,
    };
  }
};

// Get database information
export const getDatabaseInfo = () => {
  return {
    provider: config.database.provider,
    url: config.database.url.replace(/\/\/.*@/, '//***:***@'),
    environment: config.nodeEnv,
    ssl: config.database.ssl,
    logLevel: config.databaseSettings.logLevel,
  };
};