import { Router } from 'express';
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

export default router;