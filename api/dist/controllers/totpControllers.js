"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOTPController = void 0;
const express_validator_1 = require("express-validator");
const totpService_1 = require("../services/totpService");
const database_1 = require("../config/database");
class TOTPController {
    constructor() {
        /**
         * POST /api/v1/totp/setup
         * Generate TOTP secret and QR code for user
         */
        this.setupTOTP = async (req, res) => {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        success: false,
                        error: 'Validation failed',
                        details: errors.array()
                    });
                    return;
                }
                const userId = req.user.id;
                // Get user email
                const user = await database_1.prisma.user.findUnique({
                    where: { id: userId },
                    select: { email: true, mfaEnabled: true }
                });
                if (!user) {
                    res.status(404).json({
                        success: false,
                        error: 'User not found'
                    });
                    return;
                }
                // Check if TOTP is already enabled
                if (user.mfaEnabled) {
                    res.status(400).json({
                        success: false,
                        error: 'TOTP is already enabled'
                    });
                    return;
                }
                // Generate TOTP secret and QR code
                const result = await totpService_1.totpService.generateTOTPSecret(userId, user.email);
                if (result.success) {
                    res.status(200).json({
                        success: true,
                        data: {
                            secret: result.secret,
                            qrCode: result.qrCode,
                            manualEntryKey: result.manualEntryKey,
                            backupCodes: result.backupCodes,
                            instructions: {
                                step1: 'Scan the QR code with your authenticator app (Google Authenticator, Microsoft Authenticator, etc.)',
                                step2: 'Or manually enter the secret key in your app',
                                step3: 'Enter the 6-digit code from your app to verify setup',
                                step4: 'Save your backup codes securely for account recovery'
                            },
                            supportedApps: totpService_1.totpService.getTOTPInfo().supportedApps
                        }
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: result.message || 'Failed to setup TOTP'
                    });
                }
            }
            catch (error) {
                console.error('TOTP setup error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        };
        /**
         * POST /api/v1/totp/verify-setup
         * Verify TOTP token during setup process
         */
        this.verifyTOTPSetup = async (req, res) => {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        success: false,
                        error: 'Validation failed',
                        details: errors.array()
                    });
                    return;
                }
                const { secret, token } = req.body;
                const result = await totpService_1.totpService.verifyTOTPSetup(secret, token);
                if (result.success && result.valid) {
                    res.status(200).json({
                        success: true,
                        message: 'TOTP verification successful',
                        valid: true
                    });
                }
                else {
                    res.status(400).json({
                        success: false,
                        error: result.message || 'Invalid TOTP token',
                        valid: false
                    });
                }
            }
            catch (error) {
                console.error('TOTP setup verification error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        };
        /**
         * POST /api/v1/totp/enable
         * Enable TOTP after successful verification
         */
        this.enableTOTP = async (req, res) => {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        success: false,
                        error: 'Validation failed',
                        details: errors.array()
                    });
                    return;
                }
                const { secret, verificationToken } = req.body;
                const userId = req.user.id;
                const result = await totpService_1.totpService.enableTOTP(userId, secret, verificationToken);
                if (result.success) {
                    res.status(200).json({
                        success: true,
                        data: {
                            qrCode: result.qrCode,
                            manualEntryKey: result.manualEntryKey,
                            backupCodes: result.backupCodes,
                            message: result.message
                        }
                    });
                }
                else {
                    res.status(400).json({
                        success: false,
                        error: result.message || 'Failed to enable TOTP'
                    });
                }
            }
            catch (error) {
                console.error('TOTP enable error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        };
        /**
         * POST /api/v1/totp/verify
         * Verify TOTP token for authentication
         */
        this.verifyTOTP = async (req, res) => {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        success: false,
                        error: 'Validation failed',
                        details: errors.array()
                    });
                    return;
                }
                const { userId, token, window } = req.body;
                const result = await totpService_1.totpService.verifyTOTPToken(userId, token, window);
                if (result.success) {
                    res.status(200).json({
                        success: true,
                        valid: result.valid,
                        message: result.message
                    });
                }
                else {
                    res.status(401).json({
                        success: false,
                        error: result.message || 'TOTP verification failed'
                    });
                }
            }
            catch (error) {
                console.error('TOTP verification error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        };
        /**
         * POST /api/v1/totp/backup-code/verify
         * Verify backup code
         */
        this.verifyBackupCode = async (req, res) => {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        success: false,
                        error: 'Validation failed',
                        details: errors.array()
                    });
                    return;
                }
                const { userId, code } = req.body;
                const isValid = await totpService_1.totpService.verifyBackupCode(userId, code);
                if (isValid) {
                    res.status(200).json({
                        success: true,
                        message: 'Backup code verified successfully'
                    });
                }
                else {
                    res.status(401).json({
                        success: false,
                        error: 'Invalid backup code'
                    });
                }
            }
            catch (error) {
                console.error('Backup code verification error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        };
        /**
         * POST /api/v1/totp/backup-code/regenerate
         * Generate new backup codes
         */
        this.regenerateBackupCodes = async (req, res) => {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        success: false,
                        error: 'Validation failed',
                        details: errors.array()
                    });
                    return;
                }
                const { password } = req.body;
                const userId = req.user.id;
                // Verify password first
                const user = await database_1.prisma.user.findUnique({
                    where: { id: userId },
                    select: { password: true }
                });
                if (!user) {
                    res.status(404).json({
                        success: false,
                        error: 'User not found'
                    });
                    return;
                }
                const bcrypt = require('bcryptjs');
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    res.status(401).json({
                        success: false,
                        error: 'Invalid password'
                    });
                    return;
                }
                // Generate new backup codes
                const newBackupCodes = await totpService_1.totpService.regenerateBackupCodes(userId);
                res.status(200).json({
                    success: true,
                    data: {
                        backupCodes: newBackupCodes,
                        message: 'New backup codes generated. Save them securely.'
                    }
                });
            }
            catch (error) {
                console.error('Regenerate backup codes error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        };
        /**
         * GET /api/v1/totp/info
         * Get TOTP configuration and supported apps
         */
        this.getTOTPInfo = async (req, res) => {
            try {
                const info = totpService_1.totpService.getTOTPInfo();
                res.status(200).json({
                    success: true,
                    data: {
                        ...info,
                        timeRemaining: totpService_1.totpService.getTimeRemaining(),
                        instructions: {
                            howToSetup: [
                                '1. Download an authenticator app (Google Authenticator, Microsoft Authenticator, etc.)',
                                '2. Scan the QR code or manually enter the secret key',
                                '3. Enter the 6-digit code to verify setup',
                                '4. Save backup codes securely for account recovery'
                            ],
                            howToUse: [
                                '1. Open your authenticator app',
                                '2. Find the entry for Aether Identity',
                                '3. Enter the current 6-digit code',
                                '4. Codes refresh every 30 seconds'
                            ]
                        }
                    }
                });
            }
            catch (error) {
                console.error('Get TOTP info error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        };
        /**
         * GET /api/v1/totp/current-token
         * Get current TOTP token (for testing only)
         */
        this.getCurrentToken = async (req, res) => {
            try {
                const { secret } = req.query;
                if (!secret || typeof secret !== 'string') {
                    res.status(400).json({
                        success: false,
                        error: 'Secret parameter is required'
                    });
                    return;
                }
                const token = totpService_1.totpService.getCurrentTOTPToken(secret);
                const timeRemaining = totpService_1.totpService.getTimeRemaining();
                res.status(200).json({
                    success: true,
                    data: {
                        token,
                        timeRemaining,
                        expiresIn: timeRemaining
                    }
                });
            }
            catch (error) {
                console.error('Get current token error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        };
    }
}
exports.TOTPController = TOTPController;
