"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const ssoControllers_1 = require("../controllers/ssoControllers");
const rateLimitMiddleware_1 = require("../middlewares/rateLimitMiddleware");
const router = (0, express_1.Router)();
const ssoController = new ssoControllers_1.SSOController();
// Rate limiting for SSO endpoints
const ssoRateLimit = (0, rateLimitMiddleware_1.rateLimitMiddleware)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    message: {
        error: 'Too many SSO requests, please try again later.',
    },
});
/**
 * @route   GET /api/v1/auth/sso/authorize
 * @desc    SSO Authorization endpoint - brokers request to Identity
 * @access  Public
 */
router.get('/authorize', [
    ssoRateLimit,
    (0, express_validator_1.query)('client_id').notEmpty().withMessage('Client ID is required'),
    (0, express_validator_1.query)('response_type').equals('code').withMessage('Response type must be code'),
    (0, express_validator_1.query)('redirect_uri').optional().isURL().withMessage('Valid redirect URI is required'),
    (0, express_validator_1.query)('state').optional().isString(),
    (0, express_validator_1.query)('scope').optional().isString(),
    (0, express_validator_1.query)('code_challenge').optional().isString(),
    (0, express_validator_1.query)('code_challenge_method').optional().isIn(['S256', 'plain']),
    (0, express_validator_1.query)('final_redirect_url').optional().isURL().withMessage('Valid final redirect URL is required'),
], ssoController.authorize);
/**
 * @route   POST /api/v1/auth/sso/token
 * @desc    SSO Token endpoint - exchange authorization code for tokens
 * @access  Public
 */
router.post('/token', [
    ssoRateLimit,
    (0, express_validator_1.body)('grant_type').equals('authorization_code').withMessage('Grant type must be authorization_code'),
    (0, express_validator_1.body)('code').notEmpty().withMessage('Authorization code is required'),
    (0, express_validator_1.body)('client_id').notEmpty().withMessage('Client ID is required'),
    (0, express_validator_1.body)('client_secret').optional().isString(),
    (0, express_validator_1.body)('redirect_uri').optional().isURL().withMessage('Valid redirect URI is required'),
    (0, express_validator_1.body)('code_verifier').optional().isString(),
], ssoController.token);
/**
 * @route   POST /api/v1/auth/sso/refresh
 * @desc    SSO Refresh token endpoint
 * @access  Public
 */
router.post('/refresh', [
    ssoRateLimit,
    (0, express_validator_1.body)('refresh_token').notEmpty().withMessage('Refresh token is required'),
], ssoController.refresh);
/**
 * @route   POST /api/v1/auth/sso/logout
 * @desc    SSO Logout endpoint - clears API session and forwards to Identity
 * @access  Public
 */
router.post('/logout', ssoController.logout);
/**
 * @route   GET /api/v1/auth/sso/logout/callback
 * @desc    SSO Logout callback from Identity
 * @access  Public
 */
router.get('/logout/callback', ssoController.logoutCallback);
/**
 * @route   GET /api/v1/auth/sso/callback
 * @desc    SSO callback from Identity - handles authentication result
 * @access  Public
 */
router.get('/callback', ssoController.callback);
/**
 * @route   GET /api/v1/auth/sso/.well-known/openid_configuration
 * @desc    OpenID Connect discovery endpoint
 * @access  Public
 */
router.get('/.well-known/openid_configuration', ssoController.openidConfiguration);
/**
 * @route   GET /api/v1/auth/sso/.well-known/jwks.json
 * @desc    JSON Web Key Set endpoint
 * @access  Public
 */
router.get('/.well-known/jwks.json', ssoController.jwks);
exports.default = router;
