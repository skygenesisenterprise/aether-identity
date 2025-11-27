import { PrismaClient } from '@prisma/client';

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
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
};

// Try to create Prisma client with fallback
let prisma: any;
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Error creating Prisma client:', error);
  // Fallback for build environment
  prisma = {} as any;
}

export { prisma };

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
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