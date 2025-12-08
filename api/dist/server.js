"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = require("./config/database");
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: database_1.config.cors.origin,
    credentials: database_1.config.cors.credentials,
}));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: database_1.config.nodeEnv,
        version: '1.0.0',
        services: {
            database: 'connected',
            api: 'running',
            monitoring: 'active'
        }
    });
});
// API routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const accountRoutes_1 = __importDefault(require("./routes/accountRoutes"));
const apiTokenRoutes_1 = __importDefault(require("./routes/apiTokenRoutes"));
const clientApplicationRoutes_1 = __importDefault(require("./routes/clientApplicationRoutes"));
const ssoRoutes_1 = __importDefault(require("./routes/ssoRoutes"));
const mfaRoutes_1 = __importDefault(require("./routes/mfaRoutes"));
const totpRoutes_1 = __importDefault(require("./routes/totpRoutes"));
const qrcodeRoutes_1 = __importDefault(require("./routes/qrcodeRoutes"));
const oidcRoutes_1 = __importDefault(require("./routes/oidcRoutes"));
const webhookRoutes_1 = __importDefault(require("./routes/webhookRoutes"));
const roleRoutes_1 = __importDefault(require("./routes/roleRoutes"));
const loginPageRoutes_1 = __importDefault(require("./routes/loginPageRoutes"));
// OIDC well-known endpoints
app.use('/.well-known', oidcRoutes_1.default);
// API v1 routes
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/auth', loginPageRoutes_1.default);
app.use('/api/v1/auth/sso', ssoRoutes_1.default);
app.use('/api/v1/mfa', mfaRoutes_1.default);
app.use('/api/v1/totp', totpRoutes_1.default);
app.use('/api/v1/qrcode', qrcodeRoutes_1.default);
app.use('/api/v1/accounts', accountRoutes_1.default);
app.use('/api/v1/api-tokens', apiTokenRoutes_1.default);
app.use('/api/v1/clients', clientApplicationRoutes_1.default);
app.use('/api/v1/webhooks', webhookRoutes_1.default);
app.use('/api/v1/roles', roleRoutes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method,
    });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(err.status || 500).json({
        error: database_1.config.nodeEnv === 'production' ? 'Internal server error' : err.message,
        ...(database_1.config.nodeEnv !== 'production' && { stack: err.stack }),
    });
});
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        const server = app.listen(database_1.config.port, '0.0.0.0', () => {
            console.log(`🚀 API Server running on port ${database_1.config.port}`);
            console.log(`📊 Environment: ${database_1.config.nodeEnv}`);
            console.log(`🔗 Health check: http://localhost:${database_1.config.port}/health`);
            console.log(`📝 API Documentation: http://localhost:${database_1.config.port}/api/v1/docs`);
        });
        // Graceful shutdown
        const gracefulShutdown = async (signal) => {
            console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
            server.close(async () => {
                console.log('🔌 HTTP server closed');
                await (0, database_1.disconnectDatabase)();
                console.log('👋 Server shut down complete');
                process.exit(0);
            });
            // Force shutdown after 30 seconds
            setTimeout(() => {
                console.error('❌ Forced shutdown due to timeout');
                process.exit(1);
            }, 30000);
        };
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});
// Start server
if (require.main === module) {
    startServer();
}
exports.default = app;
