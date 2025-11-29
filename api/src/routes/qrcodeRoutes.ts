import { Router } from 'express';
import { body, query } from 'express-validator';
import { QRCodeController } from '../controllers/qrcodeControllers';
import { rateLimitMiddleware } from '../middlewares/rateLimitMiddleware';

const router = Router();
const qrCodeController = new QRCodeController();

// Rate limiting for QR code endpoints
const qrCodeRateLimit = rateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 QR code requests per windowMs
  message: {
    error: 'Too many QR code requests, please try again later.',
  },
});

/**
 * @route   POST /api/v1/qrcode/totp/setup
 * @desc    Generate TOTP QR code for user - accessible via curl
 * @access  Public (requires email + password)
 */
router.post('/totp/setup', [
  qrCodeRateLimit,
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], qrCodeController.generateTOTPQRCode);

/**
 * @route   GET /api/v1/qrcode/totp/current
 * @desc    Get current TOTP QR code for existing user
 * @access  Public (requires email + password as query params)
 */
router.get('/totp/current', [
  qrCodeRateLimit,
  query('email').isEmail().withMessage('Valid email is required'),
  query('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], qrCodeController.getCurrentTOTPQRCode);

/**
 * @route   POST /api/v1/qrcode/totp/verify
 * @desc    Verify TOTP token and enable MFA
 * @access  Public (requires email + password + token + secret)
 */
router.post('/totp/verify', [
  qrCodeRateLimit,
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('token').isLength({ min: 6, max: 6 }).withMessage('Token must be 6 digits'),
  body('secret').notEmpty().withMessage('Secret is required'),
], qrCodeController.verifyAndEnableTOTP);

/**
 * @route   GET /api/v1/qrcode/totp/test
 * @desc    Test TOTP token generation (development only)
 * @access  Public
 */
router.get('/totp/test', [
  query('secret').notEmpty().withMessage('Secret parameter is required'),
], qrCodeController.testTOTPToken);

export default router;