import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { sendEmail, sendSMS } from '../lib/notificationService';

export interface MFASetupRequest {
  userId: string;
  method: 'TOTP' | 'SMS' | 'EMAIL';
  phoneNumber?: string;
}

export interface MFAVerificationRequest {
  userId: string;
  sessionId: string;
  code: string;
  method?: 'TOTP' | 'SMS' | 'EMAIL' | 'BACKUP_CODE';
}

export interface MFASetupResult {
  success: boolean;
  secret?: string;
  qrCode?: string;
  backupCodes?: string[];
  message?: string;
}

export interface MFAVerificationResult {
  success: boolean;
  requiresMFA?: boolean;
  mfaMethod?: string;
  message?: string;
  remainingAttempts?: number;
}

export class MFAService {
  private readonly codeExpiry = 5 * 60 * 1000; // 5 minutes
  private readonly maxAttempts = 3;
  private readonly backupCodeCount = 10;

  /**
   * Setup MFA for a user
   */
  async setupMFA(request: MFASetupRequest): Promise<MFASetupResult> {
    try {
      const user = await prisma.user.findUnique({
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
    } catch (error) {
      console.error('MFA setup error:', error);
      return { success: false, message: 'Failed to setup MFA' };
    }
  }

  /**
   * Verify MFA code
   */
  async verifyMFA(request: MFAVerificationRequest): Promise<MFAVerificationResult> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: request.userId }
      });

      if (!user || !user.mfaEnabled) {
        return { success: false, message: 'MFA not enabled for user' };
      }

      // Get or create MFA session
      let mfaSession = await prisma.mfaSession.findUnique({
        where: { sessionId: request.sessionId }
      });

      if (!mfaSession) {
        // Create new MFA session
        mfaSession = await prisma.mfaSession.create({
          data: {
            id: crypto.randomUUID(),
            userId: request.userId,
            sessionId: request.sessionId,
            method: request.method || user.mfaMethod!,
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
      const method = request.method || user.mfaMethod!;

      switch (method) {
        case 'TOTP':
          isValid = this.verifyTOTPCode(user.mfaSecret!, request.code);
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
      await prisma.mfaSession.update({
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
      await prisma.user.update({
        where: { id: user.id },
        data: { lastMfaUsed: new Date() }
      });

      return { success: true };

    } catch (error) {
      console.error('MFA verification error:', error);
      return { success: false, message: 'Verification failed' };
    }
  }

  /**
   * Send MFA code
   */
  async sendMFACode(userId: string, sessionId: string, method: 'SMS' | 'EMAIL'): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return false;
      }

      const code = this.generateNumericCode(6);
      const expiresAt = new Date(Date.now() + this.codeExpiry);

      // Update MFA session with new code
      await prisma.mfaSession.upsert({
        where: { sessionId },
        update: {
          code,
          codeExpiresAt: expiresAt,
          attempts: 0,
          method
        },
        create: {
          id: crypto.randomUUID(),
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
        await sendSMS(user.phoneNumber, `Your Aether Identity verification code is: ${code}`);
      } else if (method === 'EMAIL') {
        await sendEmail(user.email, 'Aether Identity Verification Code', 
          `Your verification code is: ${code}. This code will expire in 5 minutes.`);
      }

      return true;
    } catch (error) {
      console.error('Failed to send MFA code:', error);
      return false;
    }
  }

  /**
   * Disable MFA for user
   */
  async disableMFA(userId: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const user = await prisma.user.findUnique({
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
      await prisma.user.update({
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
      await prisma.mfaSession.deleteMany({
        where: { userId }
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to disable MFA:', error);
      return { success: false, message: 'Failed to disable MFA' };
    }
  }

  /**
   * Setup TOTP MFA
   */
  private async setupTOTP(user: any): Promise<MFASetupResult> {
    try {
      const secret = speakeasy.generateSecret({
        name: `Aether Identity (${user.email})`,
        issuer: 'Aether Identity',
        length: 32
      });

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

      // Generate backup codes
      const backupCodes = this.generateBackupCodes();

      // Update user with MFA settings
      await prisma.user.update({
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
    } catch (error) {
      console.error('TOTP setup error:', error);
      return { success: false, message: 'Failed to setup TOTP' };
    }
  }

  /**
   * Setup SMS MFA
   */
  private async setupSMS(user: any, phoneNumber?: string): Promise<MFASetupResult> {
    try {
      if (!phoneNumber && !user.phoneNumber) {
        return { success: false, message: 'Phone number required for SMS MFA' };
      }

      const targetPhone = phoneNumber || user.phoneNumber;

      // Generate backup codes
      const backupCodes = this.generateBackupCodes();

      // Update user with MFA settings
      await prisma.user.update({
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
      await this.sendMFACode(user.id, crypto.randomUUID(), 'SMS');

      return {
        success: true,
        message: 'SMS MFA enabled. Verification code sent to your phone.',
        backupCodes
      };
    } catch (error) {
      console.error('SMS setup error:', error);
      return { success: false, message: 'Failed to setup SMS MFA' };
    }
  }

  /**
   * Setup Email MFA
   */
  private async setupEmail(user: any): Promise<MFASetupResult> {
    try {
      // Generate backup codes
      const backupCodes = this.generateBackupCodes();

      // Update user with MFA settings
      await prisma.user.update({
        where: { id: user.id },
        data: {
          mfaEnabled: true,
          mfaMethod: 'EMAIL',
          backupCodes: JSON.stringify(backupCodes),
          mfaCreatedAt: new Date()
        }
      });

      // Send verification code
      await this.sendMFACode(user.id, crypto.randomUUID(), 'EMAIL');

      return {
        success: true,
        message: 'Email MFA enabled. Verification code sent to your email.',
        backupCodes
      };
    } catch (error) {
      console.error('Email setup error:', error);
      return { success: false, message: 'Failed to setup Email MFA' };
    }
  }

  /**
   * Verify TOTP code
   */
  private verifyTOTPCode(secret: string, token: string): boolean {
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
  private async verifyEmailOrSMSCode(mfaSession: any, code: string): Promise<boolean> {
    return mfaSession.code === code;
  }

  /**
   * Verify backup code
   */
  private async verifyBackupCode(user: any, code: string): Promise<boolean> {
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
    
    await prisma.user.update({
      where: { id: user.id },
      data: { backupCodes: JSON.stringify(backupCodes) }
    });

    return true;
  }

  /**
   * Generate numeric code for SMS/Email
   */
  private generateNumericCode(length: number): string {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += digits[crypto.randomInt(0, digits.length)];
    }
    return code;
  }

  /**
   * Generate backup codes
   */
  private generateBackupCodes(): string[] {
    const codes = [];
    for (let i = 0; i < this.backupCodeCount; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  /**
   * Check if user requires MFA
   */
  async checkMFARequired(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mfaEnabled: true }
    });

    return user?.mfaEnabled || false;
  }

  /**
   * Get MFA status for user
   */
  async getMFAStatus(userId: string): Promise<{
    enabled: boolean;
    method?: string;
    phoneNumber?: string;
    hasBackupCodes: boolean;
    mfaCreatedAt?: Date;
    lastMfaUsed?: Date;
  }> {
    const user = await prisma.user.findUnique({
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

export const mfaService = new MFAService();