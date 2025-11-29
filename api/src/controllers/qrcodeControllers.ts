import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { totpService } from '../services/totpService';
import { authMiddleware } from '../middlewares/authMiddlewares';
import { prisma } from '../config/database';

export class QRCodeController {
  /**
   * POST /api/v1/qrcode/totp/setup
   * Generate TOTP QR code for user - accessible via curl
   */
  public generateTOTPQRCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
        return;
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
        select: { 
          id: true, 
          email: true, 
          password: true, 
          mfaEnabled: true,
          mfaMethod: true
        }
      });

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Verify password
      const bcrypt = require('bcryptjs');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
        return;
      }

      // Check if TOTP is already enabled
      if (user.mfaEnabled && user.mfaMethod === 'TOTP') {
        res.status(400).json({
          success: false,
          error: 'TOTP is already enabled for this user'
        });
        return;
      }

      // Generate TOTP secret and QR code
      const result = await totpService.generateTOTPSecret(user.id, user.email);

      if (result.success) {
        res.status(200).json({
          success: true,
          data: {
            qrCode: result.qrCode,
            secret: result.secret,
            manualEntryKey: result.manualEntryKey,
            backupCodes: result.backupCodes,
            instructions: {
              step1: 'Scan the QR code with Google Authenticator, Microsoft Authenticator, or any TOTP app',
              step2: 'Or manually enter the secret key in your authenticator app',
              step3: 'Enter the 6-digit code from your app to verify setup',
              step4: 'Save your backup codes securely for account recovery'
            },
            supportedApps: [
              'Google Authenticator',
              'Microsoft Authenticator',
              'Authy',
              '1Password',
              'LastPass Authenticator',
              'FreeOTP',
              'andOTP'
            ],
            testing: {
              currentToken: totpService.getCurrentTOTPToken(result.secret!),
              timeRemaining: totpService.getTimeRemaining()
            }
          }
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.message || 'Failed to generate TOTP QR code'
        });
      }
    } catch (error) {
      console.error('Generate TOTP QR code error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  /**
   * GET /api/v1/qrcode/totp/current
   * Get current TOTP QR code for existing user
   */
  public getCurrentTOTPQRCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
        return;
      }

      const { email, password } = req.query;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
        return;
      }

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: email as string },
        select: { 
          id: true, 
          email: true, 
          password: true, 
          mfaEnabled: true,
          mfaMethod: true,
          mfaSecret: true
        }
      });

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Verify password
      const bcrypt = require('bcryptjs');
      const isPasswordValid = await bcrypt.compare(password as string, user.password);
      
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
        return;
      }

      // Check if TOTP is enabled
      if (!user.mfaEnabled || user.mfaMethod !== 'TOTP' || !user.mfaSecret) {
        res.status(400).json({
          success: false,
          error: 'TOTP is not enabled for this user'
        });
        return;
      }

      // Generate QR code from existing secret
      const speakeasy = require('speakeasy');
      const QRCode = require('qrcode');
      
      const otpauthUrl = speakeasy.otpauthURL({
        secret: user.mfaSecret,
        label: `Aether Identity (${user.email})`,
        issuer: 'Aether Identity',
        algorithm: 'sha256',
        digits: 6,
        period: 30
      });

      const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl, {
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      });

      res.status(200).json({
        success: true,
        data: {
          qrCode: qrCodeDataUrl,
          secret: user.mfaSecret,
          manualEntryKey: user.mfaSecret,
          instructions: {
            step1: 'Scan the QR code with your authenticator app',
            step2: 'Or manually enter the secret key',
            step3: 'Use the 6-digit code for authentication'
          },
          testing: {
            currentToken: totpService.getCurrentTOTPToken(user.mfaSecret),
            timeRemaining: totpService.getTimeRemaining()
          }
        }
      });
    } catch (error) {
      console.error('Get current TOTP QR code error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  /**
   * POST /api/v1/qrcode/totp/verify
   * Verify TOTP token and enable MFA
   */
  public verifyAndEnableTOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
        return;
      }

      const { email, password, token, secret } = req.body;

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
        select: { 
          id: true, 
          email: true, 
          password: true,
          mfaEnabled: true
        }
      });

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Verify password
      const bcrypt = require('bcryptjs');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
        return;
      }

      // Verify TOTP token
      const verification = await totpService.verifyTOTPSetup(secret, token);

      if (verification.success && verification.valid) {
        // Enable TOTP for user
        const result = await totpService.enableTOTP(user.id, secret, token);

        if (result.success) {
          res.status(200).json({
            success: true,
            message: 'TOTP enabled successfully',
            data: {
              qrCode: result.qrCode,
              backupCodes: result.backupCodes,
              instructions: 'Save your backup codes securely'
            }
          });
        } else {
          res.status(500).json({
            success: false,
            error: result.message || 'Failed to enable TOTP'
          });
        }
      } else {
        res.status(400).json({
          success: false,
          error: 'Invalid TOTP token',
          message: verification.message
        });
      }
    } catch (error) {
      console.error('Verify and enable TOTP error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  /**
   * GET /api/v1/qrcode/totp/test
   * Test TOTP token generation (development only)
   */
  public testTOTPToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { secret } = req.query;

      if (!secret || typeof secret !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Secret parameter is required'
        });
        return;
      }

      const token = totpService.getCurrentTOTPToken(secret);
      const timeRemaining = totpService.getTimeRemaining();

      res.status(200).json({
        success: true,
        data: {
          token,
          timeRemaining,
          expiresIn: timeRemaining,
          nextTokenIn: timeRemaining,
          instructions: 'Use this 6-digit code in your authenticator app'
        }
      });
    } catch (error) {
      console.error('Test TOTP token error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };
}