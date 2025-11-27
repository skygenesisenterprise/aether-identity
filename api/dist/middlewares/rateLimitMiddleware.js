"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRateLimit = exports.generalRateLimit = exports.authRateLimit = exports.rateLimitMiddleware = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rateLimitMiddleware = (options) => {
    return (0, express_rate_limit_1.default)({
        windowMs: options.windowMs,
        max: options.max,
        message: options.message,
        standardHeaders: options.standardHeaders !== false,
        legacyHeaders: options.legacyHeaders !== false,
        handler: (req, res) => {
            if (typeof options.message === 'string') {
                res.status(429).json({
                    error: options.message,
                    code: 'RATE_LIMIT_EXCEEDED',
                    retryAfter: Math.round(options.windowMs / 1000)
                });
            }
            else {
                res.status(429).json({
                    ...options.message,
                    code: 'RATE_LIMIT_EXCEEDED',
                    retryAfter: Math.round(options.windowMs / 1000)
                });
            }
        }
    });
};
exports.rateLimitMiddleware = rateLimitMiddleware;
// Predefined rate limiters
exports.authRateLimit = (0, exports.rateLimitMiddleware)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        error: 'Too many authentication attempts, please try again later.',
    },
});
exports.generalRateLimit = (0, exports.rateLimitMiddleware)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests, please try again later.',
    },
});
exports.uploadRateLimit = (0, exports.rateLimitMiddleware)({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 uploads per minute
    message: {
        error: 'Too many upload attempts, please try again later.',
    },
});
