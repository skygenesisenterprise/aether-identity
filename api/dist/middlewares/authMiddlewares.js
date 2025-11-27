"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                error: 'Access token is required',
                code: 'TOKEN_MISSING'
            });
            return;
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        try {
            const decoded = jsonwebtoken_1.default.verify(token, database_1.config.jwt.secret);
            // Attach user info to request
            req.user = {
                id: decoded.sub,
                email: decoded.email,
                role: decoded.role,
                permissions: decoded.permissions || []
            };
            next();
        }
        catch (jwtError) {
            res.status(401).json({
                error: 'Invalid or expired token',
                code: 'TOKEN_INVALID'
            });
            return;
        }
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            error: 'Authentication error',
            code: 'AUTH_ERROR'
        });
    }
};
exports.authMiddleware = authMiddleware;
const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // No token provided, continue without authentication
            next();
            return;
        }
        const token = authHeader.substring(7);
        try {
            const decoded = jsonwebtoken_1.default.verify(token, database_1.config.jwt.secret);
            req.user = {
                id: decoded.sub,
                email: decoded.email,
                role: decoded.role,
                permissions: decoded.permissions || []
            };
        }
        catch (jwtError) {
            // Invalid token, continue without authentication
            console.warn('Invalid token in optional auth:', jwtError);
        }
        next();
    }
    catch (error) {
        console.error('Optional auth middleware error:', error);
        next(); // Continue without authentication on error
    }
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
