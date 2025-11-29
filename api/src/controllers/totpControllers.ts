import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { totpService, TOTPSetupResult, TOTPVerificationResult } from '../services/totpService';
import { authMiddleware } from '../middlewares/authMiddlewares';
import { prisma } from '../config/database';

export class TOTPController {
  /**
   * POST /api/v1/totp/setup
   * Generate TOTP secret and QR code for user
   */
  public setupTOTP = async (req: Request, res: Response): Promise<void> => {
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

      const userId = (req as any).user.id;
      
      // Get user email
      const user = await prisma.user.findUnique({
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
      const result = await totpService.generateTOTPSecret(userId, user.email);

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
            supportedApps: totpService.getTOTPInfo().supportedApps
          }
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.message || 'Failed to setup TOTP'
        });
      }
    } catch (error) {
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
  public verifyTOTPSetup = async (req: Request, res: Response): Promise<void> => {
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

      const { secret, token } = req.body;

      const result = await totpService.verifyTOTPSetup(secret, token);

      if (result.success && result.valid) {
        res.status(200).json({
          success: true,
          message: 'TOTP verification successful',
          valid: true
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.message || 'Invalid TOTP token',
          valid: false
        });
      }
    } catch (error) {
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
  public enableTOTP = async (req: Request, res: Response): Promise<void> => {
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

      const { secret, verificationToken } = req.body;
      const userId = (req as any).user.id;

      const result = await totpService.enableTOTP(userId, secret, verificationToken);

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
      } else {
        res.status(400).json({
          success: false,
          error: result.message || 'Failed to enable TOTP'
        });
      }
    } catch (error) {
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
  public verifyTOTP = async (req: Request, res: Response): Promise<void> => {
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

      const { userId, token, window } = req.body;

      const result = await totpService.verifyTOTPToken(userId, token, window);

      if (result.success) {
        res.status(200).json({
          success: true,
          valid: result.valid,
          message: result.message
        });
      } else {
        res.status(401).json({
          success: false,
          error: result.message || 'TOTP verification failed'
        });
      }
    } catch (error) {
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
  public verifyBackupCode = async (req: Request, res: Response): Promise<void> => {
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

      const { userId, code } = req.body;

      const isValid = await totpService.verifyBackupCode(userId, code);

      if (isValid) {
        res.status(200).json({
          success: true,
          message: 'Backup code verified successfully'
        });
      } else {
        res.status(401).json({
          success: false,
          error: 'Invalid backup code'
        });
      }
    } catch (error) {
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
  public regenerateBackupCodes = async (req: Request, res: Response): Promise<void> => {
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

      const { password } = req.body;
      const userId = (req as any).user.id;

      // Verify password first
      const user = await prisma.user.findUnique({
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
      const newBackupCodes = await totpService.regenerateBackupCodes(userId);

      res.status(200).json({
        success: true,
        data: {
          backupCodes: newBackupCodes,
          message: 'New backup codes generated. Save them securely.'
        }
      });
    } catch (error) {
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
  public getTOTPInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const info = totpService.getTOTPInfo();

      res.status(200).json({
        success: true,
        data: {
          ...info,
          timeRemaining: totpService.getTimeRemaining(),
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
    } catch (error) {
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
  public getCurrentToken = async (req: Request, res: Response): Promise<void> => {
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
          expiresIn: timeRemaining
        }
      });
    } catch (error) {
      console.error('Get current token error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };
}