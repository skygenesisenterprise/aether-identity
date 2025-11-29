"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mfaService = exports.MFAService = void 0;
const speakeasy = __importStar(require("speakeasy"));
const QRCode = __importStar(require("qrcode"));
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("../config/database");
const notificationService_1 = require("../lib/notificationService");
class MFAService {
    constructor() {
        this.codeExpiry = 5 * 60 * 1000; // 5 minutes
        this.maxAttempts = 3;
        this.backupCodeCount = 10;
    }
    /**
     * Setup MFA for a user
     */
    async setupMFA(request) {
        try {
            const user = await database_1.prisma.user.findUnique({
                where: { id: request.userId }
            });
            if (!user) {
                return { success: false, message: 'User not found' };
            }
            switch (request.method) {
                case 'TOTP':
                    return await this.setupTOTP(user);
                case 'SMS':
                    return await this.setupSMS(user, request.phoneNumber);
                case 'EMAIL':
                    return await this.setupEmail(user);
                default:
                    return { success: false, message: 'Unsupported MFA method' };
            }
        }
        catch (error) {
            console.error('MFA setup error:', error);
            return { success: false, message: 'Failed to setup MFA' };
        }
    }
    /**
     * Verify MFA code
     */
    async verifyMFA(request) {
        try {
            const user = await database_1.prisma.user.findUnique({
                where: { id: request.userId }
            });
            if (!user || !user.mfaEnabled) {
                return { success: false, message: 'MFA not enabled for user' };
            }
            // Get or create MFA session
            let mfaSession = await database_1.prisma.mfaSession.findUnique({
                where: { sessionId: request.sessionId }
            });
            if (!mfaSession) {
                // Create new MFA session
                mfaSession = await database_1.prisma.mfaSession.create({
                    data: {
                        id: crypto_1.default.randomUUID(),
                        userId: request.userId,
                        sessionId: request.sessionId,
                        method: request.method || user.mfaMethod,
                        codeExpiresAt: new Date(Date.now() + this.codeExpiry),
                        maxAttempts: this.maxAttempts
                    }
                });
            }
            // Check if max attempts exceeded
            if (mfaSession.attempts >= mfaSession.maxAttempts) {
                return {
                    success: false,
                    message: 'Too many attempts. Please start over.',
                    remainingAttempts: 0
                };
            }
            // Check if code expired
            if (mfaSession.codeExpiresAt && mfaSession.codeExpiresAt < new Date()) {
                return { success: false, message: 'Code expired' };
            }
            // Verify code based on method
            let isValid = false;
            const method = request.method || user.mfaMethod;
            switch (method) {
                case 'TOTP':
                    isValid = this.verifyTOTPCode(user.mfaSecret, request.code);
                    break;
                case 'SMS':
                case 'EMAIL':
                    isValid = await this.verifyEmailOrSMSCode(mfaSession, request.code);
                    break;
                case 'BACKUP_CODE':
                    isValid = await this.verifyBackupCode(user, request.code);
                    break;
                default:
                    return { success: false, message: 'Invalid MFA method' };
            }
            // Update attempts
            await database_1.prisma.mfaSession.update({
                where: { id: mfaSession.id },
                data: {
                    attempts: mfaSession.attempts + 1,
                    isVerified: isValid
                }
            });
            if (!isValid) {
                return {
                    success: false,
                    message: 'Invalid code',
                    remainingAttempts: mfaSession.maxAttempts - (mfaSession.attempts + 1)
                };
            }
            // Update user's last MFA usage
            await database_1.prisma.user.update({
                where: { id: user.id },
                data: { lastMfaUsed: new Date() }
            });
            return { success: true };
        }
        catch (error) {
            console.error('MFA verification error:', error);
            return { success: false, message: 'Verification failed' };
        }
    }
    /**
     * Send MFA code
     */
    async sendMFACode(userId, sessionId, method) {
        try {
            const user = await database_1.prisma.user.findUnique({
                where: { id: userId }
            });
            if (!user) {
                return false;
            }
            const code = this.generateNumericCode(6);
            const expiresAt = new Date(Date.now() + this.codeExpiry);
            // Update MFA session with new code
            await database_1.prisma.mfaSession.upsert({
                where: { sessionId },
                update: {
                    code,
                    codeExpiresAt: expiresAt,
                    attempts: 0,
                    method
                },
                create: {
                    id: crypto_1.default.randomUUID(),
                    userId,
                    sessionId,
                    method,
                    code,
                    codeExpiresAt: expiresAt,
                    maxAttempts: this.maxAttempts
                }
            });
            // Send code via appropriate method
            if (method === 'SMS' && user.phoneNumber) {
                await (0, notificationService_1.sendSMS)(user.phoneNumber, `Your Aether Identity verification code is: ${code}`);
            }
            else if (method === 'EMAIL') {
                await (0, notificationService_1.sendEmail)(user.email, 'Aether Identity Verification Code', `Your verification code is: ${code}. This code will expire in 5 minutes.`);
            }
            return true;
        }
        catch (error) {
            console.error('Failed to send MFA code:', error);
            return false;
        }
    }
    /**
     * Disable MFA for user
     */
    async disableMFA(userId, password) {
        try {
            const user = await database_1.prisma.user.findUnique({
                where: { id: userId }
            });
            if (!user) {
                return { success: false, message: 'User not found' };
            }
            // Verify password before disabling MFA
            const bcrypt = require('bcryptjs');
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return { success: false, message: 'Invalid password' };
            }
            // Disable MFA
            await database_1.prisma.user.update({
                where: { id: userId },
                data: {
                    mfaEnabled: false,
                    mfaMethod: null,
                    mfaSecret: null,
                    backupCodes: null,
                    phoneNumber: null
                }
            });
            // Clean up MFA sessions
            await database_1.prisma.mfaSession.deleteMany({
                where: { userId }
            });
            return { success: true };
        }
        catch (error) {
            console.error('Failed to disable MFA:', error);
            return { success: false, message: 'Failed to disable MFA' };
        }
    }
    /**
     * Setup TOTP MFA
     */
    async setupTOTP(user) {
        try {
            const secret = speakeasy.generateSecret({
                name: `Aether Identity (${user.email})`,
                issuer: 'Aether Identity',
                length: 32
            });
            // Generate QR code
            const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
            // Generate backup codes
            const backupCodes = this.generateBackupCodes();
            // Update user with MFA settings
            await database_1.prisma.user.update({
                where: { id: user.id },
                data: {
                    mfaEnabled: true,
                    mfaMethod: 'TOTP',
                    mfaSecret: secret.base32,
                    backupCodes: JSON.stringify(backupCodes),
                    mfaCreatedAt: new Date()
                }
            });
            return {
                success: true,
                secret: secret.base32,
                qrCode: qrCodeUrl,
                backupCodes
            };
        }
        catch (error) {
            console.error('TOTP setup error:', error);
            return { success: false, message: 'Failed to setup TOTP' };
        }
    }
    /**
     * Setup SMS MFA
     */
    async setupSMS(user, phoneNumber) {
        try {
            if (!phoneNumber && !user.phoneNumber) {
                return { success: false, message: 'Phone number required for SMS MFA' };
            }
            const targetPhone = phoneNumber || user.phoneNumber;
            // Generate backup codes
            const backupCodes = this.generateBackupCodes();
            // Update user with MFA settings
            await database_1.prisma.user.update({
                where: { id: user.id },
                data: {
                    mfaEnabled: true,
                    mfaMethod: 'SMS',
                    phoneNumber: targetPhone,
                    backupCodes: JSON.stringify(backupCodes),
                    mfaCreatedAt: new Date()
                }
            });
            // Send verification code
            await this.sendMFACode(user.id, crypto_1.default.randomUUID(), 'SMS');
            return {
                success: true,
                message: 'SMS MFA enabled. Verification code sent to your phone.',
                backupCodes
            };
        }
        catch (error) {
            console.error('SMS setup error:', error);
            return { success: false, message: 'Failed to setup SMS MFA' };
        }
    }
    /**
     * Setup Email MFA
     */
    async setupEmail(user) {
        try {
            // Generate backup codes
            const backupCodes = this.generateBackupCodes();
            // Update user with MFA settings
            await database_1.prisma.user.update({
                where: { id: user.id },
                data: {
                    mfaEnabled: true,
                    mfaMethod: 'EMAIL',
                    backupCodes: JSON.stringify(backupCodes),
                    mfaCreatedAt: new Date()
                }
            });
            // Send verification code
            await this.sendMFACode(user.id, crypto_1.default.randomUUID(), 'EMAIL');
            return {
                success: true,
                message: 'Email MFA enabled. Verification code sent to your email.',
                backupCodes
            };
        }
        catch (error) {
            console.error('Email setup error:', error);
            return { success: false, message: 'Failed to setup Email MFA' };
        }
    }
    /**
     * Verify TOTP code
     */
    verifyTOTPCode(secret, token) {
        return speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 2, // Allow 2 steps before/after for clock drift
            time: Math.floor(Date.now() / 1000)
        });
    }
    /**
     * Verify email or SMS code
     */
    async verifyEmailOrSMSCode(mfaSession, code) {
        return mfaSession.code === code;
    }
    /**
     * Verify backup code
     */
    async verifyBackupCode(user, code) {
        if (!user.backupCodes) {
            return false;
        }
        const backupCodes = JSON.parse(user.backupCodes);
        const codeIndex = backupCodes.indexOf(code);
        if (codeIndex === -1) {
            return false;
        }
        // Remove used backup code
        backupCodes.splice(codeIndex, 1);
        await database_1.prisma.user.update({
            where: { id: user.id },
            data: { backupCodes: JSON.stringify(backupCodes) }
        });
        return true;
    }
    /**
     * Generate numeric code for SMS/Email
     */
    generateNumericCode(length) {
        const digits = '0123456789';
        let code = '';
        for (let i = 0; i < length; i++) {
            code += digits[crypto_1.default.randomInt(0, digits.length)];
        }
        return code;
    }
    /**
     * Generate backup codes
     */
    generateBackupCodes() {
        const codes = [];
        for (let i = 0; i < this.backupCodeCount; i++) {
            codes.push(crypto_1.default.randomBytes(4).toString('hex').toUpperCase());
        }
        return codes;
    }
    /**
     * Check if user requires MFA
     */
    async checkMFARequired(userId) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
            select: { mfaEnabled: true }
        });
        return user?.mfaEnabled || false;
    }
    /**
     * Get MFA status for user
     */
    async getMFAStatus(userId) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                mfaEnabled: true,
                mfaMethod: true,
                phoneNumber: true,
                backupCodes: true,
                mfaCreatedAt: true,
                lastMfaUsed: true
            }
        });
        if (!user) {
            return {
                enabled: false,
                hasBackupCodes: false
            };
        }
        return {
            enabled: user.mfaEnabled,
            method: user.mfaMethod || undefined,
            phoneNumber: user.phoneNumber || undefined,
            hasBackupCodes: !!user.backupCodes && JSON.parse(user.backupCodes).length > 0,
            mfaCreatedAt: user.mfaCreatedAt || undefined,
            lastMfaUsed: user.lastMfaUsed || undefined
        };
    }
}
exports.MFAService = MFAService;
exports.mfaService = new MFAService();
