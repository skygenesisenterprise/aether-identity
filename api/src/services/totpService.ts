import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { prisma } from '../config/database';

export interface TOTPSetupResult {
  success: boolean;
  secret?: string;
  qrCode?: string;
  manualEntryKey?: string;
  backupCodes?: string[];
  message?: string;
}

export interface TOTPVerificationResult {
  success: boolean;
  valid?: boolean;
  message?: string;
  remainingAttempts?: number;
}

export class TOTPService {
  private readonly issuer = 'Aether Identity';
  private readonly algorithm = 'sha256';
  private readonly digits = 6;
  private readonly period = 30; // 30 seconds
  private readonly window = 1; // Allow 1 step before/after for clock drift

  /**
   * Generate TOTP secret and QR code for user
   */
  async generateTOTPSecret(userId: string, userEmail: string): Promise<TOTPSetupResult> {
    try {
      // Generate secret
      const secret = speakeasy.generateSecret({
        name: `${this.issuer} (${userEmail})`,
        issuer: this.issuer,
        length: 32,
        algorithm: this.algorithm as any
      });

      // Generate QR code for easy scanning
      const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url!, {
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
      await prisma.user.update({
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

    } catch (error) {
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
  async verifyTOTPToken(userId: string, token: string, window?: number): Promise<TOTPVerificationResult> {
    try {
      // Get user's TOTP secret
      const user = await prisma.user.findUnique({
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
      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token,
        algorithm: this.algorithm as any,
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

    } catch (error) {
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
  async verifyTOTPSetup(secret: string, token: string): Promise<TOTPVerificationResult> {
    try {
      const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        algorithm: this.algorithm as any,
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

    } catch (error) {
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
  async enableTOTP(userId: string, secret: string, verificationToken: string): Promise<TOTPSetupResult> {
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
      await prisma.user.update({
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
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true }
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      const qrCodeDataUrl = await QRCode.toDataURL(
        speakeasy.otpauthURL({
          secret,
          label: `${this.issuer} (${user.email})`,
          issuer: this.issuer,
          algorithm: this.algorithm as any,
          digits: this.digits,
          period: this.period
        })!, {
          type: 'image/png',
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          width: 256
        }
      );

      return {
        success: true,
        secret,
        qrCode: qrCodeDataUrl,
        manualEntryKey: secret,
        backupCodes,
        message: 'TOTP enabled successfully'
      };

    } catch (error) {
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
  getCurrentTOTPToken(secret: string): string {
    return speakeasy.totp({
      secret,
      encoding: 'base32',
      algorithm: this.algorithm as any,
      digits: this.digits,
      period: this.period,
      time: Math.floor(Date.now() / 1000)
    });
  }

  /**
   * Get time remaining until next token refresh
   */
  getTimeRemaining(): number {
    const currentTime = Math.floor(Date.now() / 1000);
    const currentPeriod = Math.floor(currentTime / this.period);
    const nextPeriod = (currentPeriod + 1) * this.period;
    return nextPeriod - currentTime;
  }

  /**
   * Generate backup codes
   */
  private generateBackupCodes(): string[] {
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
  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { backupCodes: true }
      });

      if (!user || !user.backupCodes) {
        return false;
      }

      const backupCodes = JSON.parse(user.backupCodes);
      const normalizedCode = code.replace(/-/g, '').toUpperCase();
      
      // Find matching code
      const codeIndex = backupCodes.findIndex((backupCode: string) => {
        const normalizedBackupCode = backupCode.replace(/-/g, '').toUpperCase();
        return normalizedBackupCode === normalizedCode;
      });

      if (codeIndex === -1) {
        return false;
      }

      // Remove used backup code
      backupCodes.splice(codeIndex, 1);
      
      await prisma.user.update({
        where: { id: userId },
        data: { backupCodes: JSON.stringify(backupCodes) }
      });

      return true;

    } catch (error) {
      console.error('Backup code verification error:', error);
      return false;
    }
  }

  /**
   * Get TOTP configuration info
   */
  getTOTPInfo(): {
    issuer: string;
    algorithm: string;
    digits: number;
    period: number;
    window: number;
    supportedApps: string[];
  } {
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
  async regenerateBackupCodes(userId: string): Promise<string[]> {
    try {
      const newBackupCodes = this.generateBackupCodes();
      
      await prisma.user.update({
        where: { id: userId },
        data: { backupCodes: JSON.stringify(newBackupCodes) }
      });

      return newBackupCodes;

    } catch (error) {
      console.error('Backup codes regeneration error:', error);
      throw new Error('Failed to regenerate backup codes');
    }
  }
}

export const totpService = new TOTPService();