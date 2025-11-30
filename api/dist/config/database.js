"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = exports.prisma = exports.config = void 0;
const client_1 = require("@prisma/client");
exports.config = {
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        url: process.env.DATABASE_URL || 'file:./api/prisma/dev.db',
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
};
// Try to create Prisma client with fallback
let prisma;
try {
    exports.prisma = prisma = new client_1.PrismaClient();
}
catch (error) {
    console.error('Error creating Prisma client:', error);
    // Fallback for build environment
    exports.prisma = prisma = {};
}
const connectDatabase = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    try {
        await prisma.$disconnect();
        console.log('✅ Database disconnected successfully');
    }
    catch (error) {
        console.error('❌ Database disconnection failed:', error);
    }
};
exports.disconnectDatabase = disconnectDatabase;
