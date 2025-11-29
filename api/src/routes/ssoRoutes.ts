import { Router } from 'express';
import { body, query } from 'express-validator';
import { SSOController } from '../controllers/ssoControllers';
import { rateLimitMiddleware } from '../middlewares/rateLimitMiddleware';

const router = Router();
const ssoController = new SSOController();

// Rate limiting for SSO endpoints
const ssoRateLimit = rateLimitMiddleware({
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
  query('client_id').notEmpty().withMessage('Client ID is required'),
  query('response_type').equals('code').withMessage('Response type must be code'),
  query('redirect_uri').optional().isURL().withMessage('Valid redirect URI is required'),
  query('state').optional().isString(),
  query('scope').optional().isString(),
  query('code_challenge').optional().isString(),
  query('code_challenge_method').optional().isIn(['S256', 'plain']),
  query('final_redirect_url').optional().isURL().withMessage('Valid final redirect URL is required'),
], ssoController.authorize);

/**
 * @route   POST /api/v1/auth/sso/token
 * @desc    SSO Token endpoint - exchange authorization code for tokens
 * @access  Public
 */
router.post('/token', [
  ssoRateLimit,
  body('grant_type').equals('authorization_code').withMessage('Grant type must be authorization_code'),
  body('code').notEmpty().withMessage('Authorization code is required'),
  body('client_id').notEmpty().withMessage('Client ID is required'),
  body('client_secret').optional().isString(),
  body('redirect_uri').optional().isURL().withMessage('Valid redirect URI is required'),
  body('code_verifier').optional().isString(),
], ssoController.token);

/**
 * @route   POST /api/v1/auth/sso/refresh
 * @desc    SSO Refresh token endpoint
 * @access  Public
 */
router.post('/refresh', [
  ssoRateLimit,
  body('refresh_token').notEmpty().withMessage('Refresh token is required'),
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

export default router;