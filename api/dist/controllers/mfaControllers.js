"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MFAController = void 0;
const express_validator_1 = require("express-validator");
const mfaService_1 = require("../services/mfaService");
const database_1 = require("../config/database");
class MFAController {
    constructor() {
        /**
         * POST /api/v1/mfa/setup
         * Setup MFA for authenticated user
         */
        this.setupMFA = async (req, res) => {
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
                const { method, phoneNumber } = req.body;
                const userId = req.user.id;
                const result = await mfaService_1.mfaService.setupMFA({
                    userId,
                    method,
                    phoneNumber
                });
                if (result.success) {
                    res.status(200).json({
                        success: true,
                        data: {
                            method,
                            secret: result.secret,
                            qrCode: result.qrCode,
                            backupCodes: result.backupCodes,
                            message: result.message
                        }
                    });
                }
                else {
                    res.status(400).json({
                        success: false,
                        error: result.message || 'Failed to setup MFA'
                    });
                }
            }
            catch (error) {
                console.error('MFA setup error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        };
        /**
         * POST /api/v1/mfa/verify
         * Verify MFA code during authentication
         */
        this.verifyMFA = async (req, res) => {
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
                const { userId, sessionId, code, method } = req.body;
                const result = await mfaService_1.mfaService.verifyMFA({
                    userId,
                    sessionId,
                    code,
                    method
                });
                if (result.success) {
                    res.status(200).json({
                        success: true,
                        message: 'MFA verification successful'
                    });
                }
                else {
                    res.status(401).json({
                        success: false,
                        error: result.message || 'MFA verification failed',
                        remainingAttempts: result.remainingAttempts
                    });
                }
            }
            catch (error) {
                console.error('MFA verification error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        };
        /**
         * POST /api/v1/mfa/send-code
         * Send MFA code via SMS or Email
         */
        this.sendMFACode = async (req, res) => {
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
                const { userId, sessionId, method } = req.body;
                const success = await mfaService_1.mfaService.sendMFACode(userId, sessionId, method);
                if (success) {
                    res.status(200).json({
                        success: true,
                        message: `Verification code sent via ${method}`
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: 'Failed to send verification code'
                    });
                }
            }
            catch (error) {
                console.error('Send MFA code error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        };
        /**
         * POST /api/v1/mfa/disable
         * Disable MFA for authenticated user
         */
        this.disableMFA = async (req, res) => {
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
                const result = await mfaService_1.mfaService.disableMFA(userId, password);
                if (result.success) {
                    res.status(200).json({
                        success: true,
                        message: 'MFA disabled successfully'
                    });
                }
                else {
                    res.status(400).json({
                        success: false,
                        error: result.message || 'Failed to disable MFA'
                    });
                }
            }
            catch (error) {
                console.error('MFA disable error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        };
        /**
         * GET /api/v1/mfa/status
         * Get MFA status for authenticated user
         */
        this.getMFAStatus = async (req, res) => {
            try {
                const userId = req.user.id;
                const status = await mfaService_1.mfaService.getMFAStatus(userId);
                res.status(200).json({
                    success: true,
                    data: status
                });
            }
            catch (error) {
                console.error('Get MFA status error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        };
        /**
         * POST /api/v1/mfa/check-required
         * Check if MFA is required for authentication
         */
        this.checkMFARequired = async (req, res) => {
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
                const { userId } = req.body;
                const isRequired = await mfaService_1.mfaService.checkMFARequired(userId);
                res.status(200).json({
                    success: true,
                    data: {
                        mfaRequired: isRequired
                    }
                });
            }
            catch (error) {
                console.error('Check MFA required error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        };
        /**
         * GET /api/v1/mfa/backup-codes
         * Get new backup codes (requires password confirmation)
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
                const bcrypt = require('bcryptjs');
                const user = await database_1.prisma.user.findUnique({
                    where: { id: userId }
                });
                if (!user) {
                    res.status(404).json({
                        success: false,
                        error: 'User not found'
                    });
                    return;
                }
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    res.status(401).json({
                        success: false,
                        error: 'Invalid password'
                    });
                    return;
                }
                // Generate new backup codes
                const result = await mfaService_1.mfaService.setupMFA({
                    userId,
                    method: user.mfaMethod
                });
                if (result.success && result.backupCodes) {
                    res.status(200).json({
                        success: true,
                        data: {
                            backupCodes: result.backupCodes,
                            message: 'New backup codes generated. Save them securely.'
                        }
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: 'Failed to generate backup codes'
                    });
                }
            }
            catch (error) {
                console.error('Regenerate backup codes error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        };
    }
}
exports.MFAController = MFAController;
