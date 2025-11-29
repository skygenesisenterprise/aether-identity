"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const qrcodeControllers_1 = require("../controllers/qrcodeControllers");
const rateLimitMiddleware_1 = require("../middlewares/rateLimitMiddleware");
const router = (0, express_1.Router)();
const qrCodeController = new qrcodeControllers_1.QRCodeController();
// Rate limiting for QR code endpoints
const qrCodeRateLimit = (0, rateLimitMiddleware_1.rateLimitMiddleware)({
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
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], qrCodeController.generateTOTPQRCode);
/**
 * @route   GET /api/v1/qrcode/totp/current
 * @desc    Get current TOTP QR code for existing user
 * @access  Public (requires email + password as query params)
 */
router.get('/totp/current', [
    qrCodeRateLimit,
    (0, express_validator_1.query)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.query)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], qrCodeController.getCurrentTOTPQRCode);
/**
 * @route   POST /api/v1/qrcode/totp/verify
 * @desc    Verify TOTP token and enable MFA
 * @access  Public (requires email + password + token + secret)
 */
router.post('/totp/verify', [
    qrCodeRateLimit,
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('token').isLength({ min: 6, max: 6 }).withMessage('Token must be 6 digits'),
    (0, express_validator_1.body)('secret').notEmpty().withMessage('Secret is required'),
], qrCodeController.verifyAndEnableTOTP);
/**
 * @route   GET /api/v1/qrcode/totp/test
 * @desc    Test TOTP token generation (development only)
 * @access  Public
 */
router.get('/totp/test', [
    (0, express_validator_1.query)('secret').notEmpty().withMessage('Secret parameter is required'),
], qrCodeController.testTOTPToken);
exports.default = router;
