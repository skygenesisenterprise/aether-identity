import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message: string | { error: string };
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
}

export const rateLimitMiddleware = (options: RateLimitOptions) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: options.message,
    standardHeaders: options.standardHeaders !== false,
    legacyHeaders: options.legacyHeaders !== false,
    handler: (req: Request, res: Response) => {
      if (typeof options.message === 'string') {
        res.status(429).json({
          error: options.message,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.round(options.windowMs / 1000)
        });
      } else {
        res.status(429).json({
          ...options.message,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.round(options.windowMs / 1000)
        });
      }
    }
  });
};

// Predefined rate limiters
export const authRateLimit = rateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
});

export const generalRateLimit = rateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests, please try again later.',
  },
});

export const uploadRateLimit = rateLimitMiddleware({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 uploads per minute
  message: {
    error: 'Too many upload attempts, please try again later.',
  },
});