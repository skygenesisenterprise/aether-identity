"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseInfo = exports.checkDatabaseHealth = exports.disconnectDatabase = exports.connectDatabase = exports.PrismaClient = exports.prisma = exports.config = void 0;
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "PrismaClient", { enumerable: true, get: function () { return client_1.PrismaClient; } });
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
exports.config = {
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        provider: databaseProvider,
        url: getDefaultDatabaseUrl(),
        ssl: databaseProvider === 'postgresql' ? process.env.POSTGRES_SSL === 'true' : false,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        expiresIn: (process.env.JWT_EXPIRES_IN || '24h'),
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
        const clientOptions = {
            datasources: {
                db: {
                    url: exports.config.database.url,
                },
            },
            log: isDevelopment ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
        };
        // Add PostgreSQL-specific options
        if (exports.config.database.provider === 'postgresql') {
            clientOptions.__internal = {
                engine: {
                    connectionTimeout: exports.config.databaseSettings.connectionTimeout,
                },
            };
        }
        return new client_1.PrismaClient(clientOptions);
    }
    catch (error) {
        console.error('❌ Error creating Prisma client:', error);
        // Fallback for build environment
        return {};
    }
};
// Singleton pattern for Prisma client
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ?? createPrismaClient();
if (isDevelopment) {
    globalForPrisma.prisma = exports.prisma;
}
// Enhanced database connection with health check
const connectDatabase = async () => {
    try {
        console.log(`🔌 Connecting to ${exports.config.database.provider} database...`);
        console.log(`📍 Database URL: ${exports.config.database.url.replace(/\/\/.*@/, '//***:***@')}`);
        await exports.prisma.$connect();
        // Test connection with a simple query
        await exports.prisma.$queryRaw `SELECT 1`;
        console.log(`✅ ${exports.config.database.provider.toUpperCase()} database connected successfully`);
        console.log(`🌍 Environment: ${exports.config.nodeEnv}`);
    }
    catch (error) {
        console.error(`❌ Database connection failed (${exports.config.database.provider}):`, error);
        if (isProduction) {
            console.error('🚨 Production database connection failed - exiting');
            process.exit(1);
        }
        else {
            console.error('⚠️ Development database connection failed - continuing with limited functionality');
        }
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    try {
        await exports.prisma.$disconnect();
        console.log('✅ Database disconnected successfully');
    }
    catch (error) {
        console.error('❌ Database disconnection failed:', error);
    }
};
exports.disconnectDatabase = disconnectDatabase;
// Database health check
const checkDatabaseHealth = async () => {
    const startTime = Date.now();
    try {
        await exports.prisma.$queryRaw `SELECT 1`;
        const responseTime = Date.now() - startTime;
        return {
            status: 'healthy',
            provider: exports.config.database.provider,
            connected: true,
            responseTime,
        };
    }
    catch (error) {
        return {
            status: 'unhealthy',
            provider: exports.config.database.provider,
            connected: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            responseTime: Date.now() - startTime,
        };
    }
};
exports.checkDatabaseHealth = checkDatabaseHealth;
// Get database information
const getDatabaseInfo = () => {
    return {
        provider: exports.config.database.provider,
        url: exports.config.database.url.replace(/\/\/.*@/, '//***:***@'),
        environment: exports.config.nodeEnv,
        ssl: exports.config.database.ssl,
        logLevel: exports.config.databaseSettings.logLevel,
    };
};
exports.getDatabaseInfo = getDatabaseInfo;
