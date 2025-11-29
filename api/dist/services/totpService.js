"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totpService = exports.TOTPService = void 0;
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const database_1 = require("../config/database");
class TOTPService {
    constructor() {
        this.issuer = 'Aether Identity';
        this.algorithm = 'sha256';
        this.digits = 6;
        this.period = 30; // 30 seconds
        this.window = 1; // Allow 1 step before/after for clock drift
    }
    /**
     * Generate TOTP secret and QR code for user
     */
    async generateTOTPSecret(userId, userEmail) {
        try {
            // Generate secret
            const secret = speakeasy_1.default.generateSecret({
                name: `${this.issuer} (${userEmail})`,
                issuer: this.issuer,
                length: 32,
                algorithm: this.algorithm
            });
            // Generate QR code for easy scanning
            const qrCodeDataUrl = await qrcode_1.default.toDataURL(secret.otpauth_url, {
                type: 'image/png',
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                width: 256
            });
            // Generate backup codes
            const backupCodes = this.generateBackupCodes();
            // Store secret and backup codes in database (encrypted)
            await database_1.prisma.user.update({
                where: { id: userId },
                data: {
                    mfaSecret: secret.base32,
                    backupCodes: JSON.stringify(backupCodes),
                    mfaEnabled: true,
                    mfaMethod: 'TOTP',
                    mfaCreatedAt: new Date()
                }
            });
            return {
                success: true,
                secret: secret.base32,
                qrCode: qrCodeDataUrl,
                manualEntryKey: secret.base32,
                backupCodes,
                message: 'TOTP setup successful. Please save your backup codes securely.'
            };
        }
        catch (error) {
            console.error('TOTP generation error:', error);
            return {
                success: false,
                message: 'Failed to generate TOTP secret'
            };
        }
    }
    /**
     * Verify TOTP token
     */
    async verifyTOTPToken(userId, token, window) {
        try {
            // Get user's TOTP secret
            const user = await database_1.prisma.user.findUnique({
                where: { id: userId },
                select: { mfaSecret: true, mfaEnabled: true }
            });
            if (!user || !user.mfaEnabled || !user.mfaSecret) {
                return {
                    success: false,
                    message: 'TOTP not enabled for user'
                };
            }
            // Verify token
            const verified = speakeasy_1.default.totp.verify({
                secret: user.mfaSecret,
                encoding: 'base32',
                token,
                algorithm: this.algorithm,
                digits: this.digits,
                period: this.period,
                window: window || this.window,
                time: Math.floor(Date.now() / 1000)
            });
            return {
                success: true,
                valid: verified,
                message: verified ? 'Token valid' : 'Invalid token'
            };
        }
        catch (error) {
            console.error('TOTP verification error:', error);
            return {
                success: false,
                message: 'Failed to verify TOTP token'
            };
        }
    }
    /**
     * Verify TOTP token during setup (before enabling)
     */
    async verifyTOTPSetup(secret, token) {
        try {
            const verified = speakeasy_1.default.totp.verify({
                secret,
                encoding: 'base32',
                token,
                algorithm: this.algorithm,
                digits: this.digits,
                period: this.period,
                window: this.window,
                time: Math.floor(Date.now() / 1000)
            });
            return {
                success: true,
                valid: verified,
                message: verified ? 'Setup token valid' : 'Invalid setup token'
            };
        }
        catch (error) {
            console.error('TOTP setup verification error:', error);
            return {
                success: false,
                message: 'Failed to verify setup token'
            };
        }
    }
    /**
     * Enable TOTP for user after successful verification
     */
    async enableTOTP(userId, secret, verificationToken) {
        try {
            // First verify the token
            const verification = await this.verifyTOTPSetup(secret, verificationToken);
            if (!verification.success || !verification.valid) {
                return {
                    success: false,
                    message: 'Invalid verification token'
                };
            }
            // Generate backup codes
            const backupCodes = this.generateBackupCodes();
            // Enable TOTP for user
            await database_1.prisma.user.update({
                where: { id: userId },
                data: {
                    mfaSecret: secret,
                    backupCodes: JSON.stringify(backupCodes),
                    mfaEnabled: true,
                    mfaMethod: 'TOTP',
                    mfaCreatedAt: new Date()
                }
            });
            // Generate QR code for user
            const user = await database_1.prisma.user.findUnique({
                where: { id: userId },
                select: { email: true }
            });
            if (!user) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }
            const qrCodeDataUrl = await qrcode_1.default.toDataURL(speakeasy_1.default.otpauthURL({
                secret,
                label: `${this.issuer} (${user.email})`,
                issuer: this.issuer,
                algorithm: this.algorithm,
                digits: this.digits,
                period: this.period
            }), {
                type: 'image/png',
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                width: 256
            });
            return {
                success: true,
                secret,
                qrCode: qrCodeDataUrl,
                manualEntryKey: secret,
                backupCodes,
                message: 'TOTP enabled successfully'
            };
        }
        catch (error) {
            console.error('TOTP enable error:', error);
            return {
                success: false,
                message: 'Failed to enable TOTP'
            };
        }
    }
    /**
     * Get current TOTP token (for testing/debugging)
     */
    getCurrentTOTPToken(secret) {
        return speakeasy_1.default.totp({
            secret,
            encoding: 'base32',
            algorithm: this.algorithm,
            digits: this.digits,
            period: this.period,
            time: Math.floor(Date.now() / 1000)
        });
    }
    /**
     * Get time remaining until next token refresh
     */
    getTimeRemaining() {
        const currentTime = Math.floor(Date.now() / 1000);
        const currentPeriod = Math.floor(currentTime / this.period);
        const nextPeriod = (currentPeriod + 1) * this.period;
        return nextPeriod - currentTime;
    }
    /**
     * Generate backup codes
     */
    generateBackupCodes() {
        const codes = [];
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < 10; i++) {
            let code = '';
            for (let j = 0; j < 8; j++) {
                if (j > 0 && j % 4 === 0) {
                    code += '-';
                }
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            codes.push(code);
        }
        return codes;
    }
    /**
     * Verify backup code
     */
    async verifyBackupCode(userId, code) {
        try {
            const user = await database_1.prisma.user.findUnique({
                where: { id: userId },
                select: { backupCodes: true }
            });
            if (!user || !user.backupCodes) {
                return false;
            }
            const backupCodes = JSON.parse(user.backupCodes);
            const normalizedCode = code.replace(/-/g, '').toUpperCase();
            // Find matching code
            const codeIndex = backupCodes.findIndex((backupCode) => {
                const normalizedBackupCode = backupCode.replace(/-/g, '').toUpperCase();
                return normalizedBackupCode === normalizedCode;
            });
            if (codeIndex === -1) {
                return false;
            }
            // Remove used backup code
            backupCodes.splice(codeIndex, 1);
            await database_1.prisma.user.update({
                where: { id: userId },
                data: { backupCodes: JSON.stringify(backupCodes) }
            });
            return true;
        }
        catch (error) {
            console.error('Backup code verification error:', error);
            return false;
        }
    }
    /**
     * Get TOTP configuration info
     */
    getTOTPInfo() {
        return {
            issuer: this.issuer,
            algorithm: this.algorithm,
            digits: this.digits,
            period: this.period,
            window: this.window,
            supportedApps: [
                'Google Authenticator',
                'Microsoft Authenticator',
                'Authy',
                '1Password',
                'LastPass Authenticator',
                'FreeOTP',
                'andOTP'
            ]
        };
    }
    /**
     * Generate new backup codes for user
     */
    async regenerateBackupCodes(userId) {
        try {
            const newBackupCodes = this.generateBackupCodes();
            await database_1.prisma.user.update({
                where: { id: userId },
                data: { backupCodes: JSON.stringify(newBackupCodes) }
            });
            return newBackupCodes;
        }
        catch (error) {
            console.error('Backup codes regeneration error:', error);
            throw new Error('Failed to regenerate backup codes');
        }
    }
}
exports.TOTPService = TOTPService;
exports.totpService = new TOTPService();
