import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthController } from '../controllers/authControllers';
import { authMiddleware } from '../middlewares/authMiddlewares';
import { rateLimitMiddleware } from '../middlewares/rateLimitMiddleware';

const router = Router();
const authController = new AuthController();

// Rate limiting for auth endpoints
const authRateLimit = rateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and return tokens
 * @access  Public
 */
router.post('/login', [
  authRateLimit,
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], authController.login);

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').notEmpty().withMessage('Full name is required'),
], authController.register);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
], authController.refreshToken);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user and invalidate tokens
 * @access  Private
 */
router.post('/logout', authMiddleware, authController.logout);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authMiddleware, authController.getCurrentUser);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password', [
  authRateLimit,
  body('email').isEmail().withMessage('Valid email is required'),
], authController.forgotPassword);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], authController.resetPassword);

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.post('/verify-email', [
  body('token').notEmpty().withMessage('Verification token is required'),
], authController.verifyEmail);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password', [
  authMiddleware,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
], authController.changePassword);

/**
 * @route   POST /api/v1/auth/login-complete
 * @desc    Complete login after MFA verification
 * @access  Public
 */
router.post('/login-complete', [
  authRateLimit,
  body('userId').notEmpty().withMessage('User ID is required'),
  body('sessionId').notEmpty().withMessage('Session ID is required'),
], authController.completeLogin);

/**
 * @route   GET /api/v1/auth/authorize
 * @desc    OAuth2 Authorization endpoint - redirects to login page
 * @access  Public
 */
router.get('/authorize', [
  // query('client_id').notEmpty().withMessage('Client ID is required'),
  // query('redirect_uri').isURL().withMessage('Valid redirect URI is required'),
  // query('response_type').equals('code').withMessage('Response type must be code'),
], authController.authorize);

/**
 * @route   POST /api/v1/auth/token
 * @desc    OAuth2 Token endpoint - exchange authorization code for tokens
 * @access  Public
 */
router.post('/token', [
  body('grant_type').equals('authorization_code').withMessage('Grant type must be authorization_code'),
  body('code').notEmpty().withMessage('Authorization code is required'),
  body('client_id').notEmpty().withMessage('Client ID is required'),
  body('client_secret').optional().notEmpty().withMessage('Client secret cannot be empty'),
  body('redirect_uri').optional().isURL().withMessage('Valid redirect URI is required'),
], authController.exchangeToken);

/**
 * @route   POST /api/v1/auth/revoke
 * @desc    OAuth2 Token revocation endpoint
 * @access  Public
 */
router.post('/revoke', [
  body('token').notEmpty().withMessage('Token is required'),
  body('token_type_hint').optional().isIn(['access_token', 'refresh_token']).withMessage('Invalid token type hint'),
], authController.revokeToken);

/**
 * @route   GET /api/v1/auth/userinfo
 * @desc    OAuth2 Userinfo endpoint - get user info from access token
 * @access  Public
 */
router.get('/userinfo', authController.getUserInfo);

/**
 * @route   GET /api/v1/debug/curl
 * @desc    Debug endpoint for curl users with examples
 * @access  Public
 */
router.get('/debug/curl', (req: Request, res: Response) => {
  res.status(200).json({
    message: '🎯 Aether Identity SSO - Debug Mode',
    service_info: {
      name: 'Aether Identity SSO',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    },
    curl_examples: {
      register_user: {
        command: 'curl -X POST https://sso.skygenesisenterprise.net/api/v1/auth/register -H "Content-Type: application/json" -d \'{"email":"test@example.com","password":"password123","fullName":"Test User"}\'',
        description: 'Register a new user account'
      },
      login_user: {
        command: 'curl -X POST https://sso.skygenesisenterprise.net/api/v1/auth/login -H "Content-Type: application/json" -d \'{"email":"test@example.com","password":"password123"}\'',
        description: 'Authenticate user and get tokens'
      },
      oauth_authorize: {
        command: 'curl -X GET "https://sso.skygenesisenterprise.net/api/v1/auth/authorize?client_id=demo&redirect_uri=https://example.com/callback&response_type=code&state=xyz123"',
        description: 'Initiate OAuth2 authorization flow'
      },
      create_client: {
        command: 'curl -X POST https://sso.skygenesisenterprise.net/api/v1/clients -H "Content-Type: application/json" -d \'{"name":"My App","redirectUris":["https://example.com/callback"],"allowedScopes":["read","profile"]}\'',
        description: 'Register a new OAuth2 client application'
      },
      get_userinfo: {
        command: 'curl -X GET https://sso.skygenesisenterprise.net/api/v1/auth/userinfo -H "Authorization: Bearer YOUR_TOKEN"',
        description: 'Get user information from access token'
      },
      health_check: {
        command: 'curl -I https://sso.skygenesisenterprise.net/health',
        description: 'Check service health status'
      }
    },
    available_endpoints: [
      { method: 'POST', path: '/api/v1/auth/register', description: 'Register new user' },
      { method: 'POST', path: '/api/v1/auth/login', description: 'User authentication' },
      { method: 'GET', path: '/api/v1/auth/authorize', description: 'OAuth2 authorization' },
      { method: 'POST', path: '/api/v1/auth/token', description: 'Exchange auth code for tokens' },
      { method: 'GET', path: '/api/v1/auth/userinfo', description: 'Get user info from token' },
      { method: 'POST', path: '/api/v1/clients', description: 'Register OAuth2 client' },
      { method: 'GET', path: '/api/v1/accounts', description: 'List user accounts' },
      { method: 'GET', path: '/api/v1/api-tokens', description: 'List API tokens' },
      { method: 'GET', path: '/health', description: 'Service health check' },
      { method: 'GET', path: '/api/v1/debug/curl', description: 'This debug endpoint' }
    ],
    documentation: {
      api_docs: 'https://wiki.skygenesisenterprise.com',
      github: 'https://github.com/skygenesisenterprise/aether-identity',
      support: 'support@aether-identity.com'
    },
    tips: [
      'Use -v flag with curl for verbose output',
      'Check X-* headers for debug information',
      'Use -H "Content-Type: application/json" for POST requests',
      'Add -i flag to include HTTP headers in response'
    ]
  });
});

export default router;