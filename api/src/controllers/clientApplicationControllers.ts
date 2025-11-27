import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middlewares/authMiddlewares';

export class ClientApplicationController {
  
  /**
   * Generate a secure client ID
   */
  private generateClientId(): string {
    const bytes = crypto.randomBytes(16);
    return `client_${bytes.toString('hex')}`;
  }

  /**
   * Generate a secure client secret
   */
  private generateClientSecret(): string {
    const bytes = crypto.randomBytes(32);
    return bytes.toString('hex');
  }

  /**
   * POST /api/v1/clients
   * Register a new client application
   */
  public createClient = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
        return;
      }

      const { 
        name, 
        description, 
        redirectUris, 
        allowedScopes, 
        defaultScopes,
        skipConsent,
        logoUrl,
        homepageUrl,
        privacyPolicyUrl,
        tosUrl,
        isConfidential
      } = req.body;

      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          error: 'User authentication required',
          code: 'USER_REQUIRED'
        });
        return;
      }

      // Generate client credentials
      const clientId = this.generateClientId();
      const clientSecret = isConfidential ? this.generateClientSecret() : null;

      // Create client application
      const client = await prisma.clientApplication.create({
        data: {
          id: uuidv4(),
          clientId,
          name,
          description,
          redirectUris: JSON.stringify(redirectUris || []),
          allowedScopes: JSON.stringify(allowedScopes || ['read', 'write']),
          defaultScopes: JSON.stringify(defaultScopes || ['read']),
          skipConsent: skipConsent || false,
          secret: clientSecret,
          logoUrl,
          homepageUrl,
          privacyPolicyUrl,
          tosUrl,
          createdBy: userId
        },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              role: true
            }
          }
        }
      });

      // Return client info (include secret only once)
      res.status(201).json({
        success: true,
        data: {
          id: client.id,
          clientId: client.clientId,
          clientSecret: client.secret, // Only return secret on creation
          name: client.name,
          description: client.description,
          redirectUris: JSON.parse(client.redirectUris),
          allowedScopes: JSON.parse(client.allowedScopes),
          defaultScopes: JSON.parse(client.defaultScopes),
          skipConsent: client.skipConsent,
          isActive: client.isActive,
          logoUrl: client.logoUrl,
          homepageUrl: client.homepageUrl,
          privacyPolicyUrl: client.privacyPolicyUrl,
          tosUrl: client.tosUrl,
          createdAt: client.createdAt,
          creator: client.creator
        }
      });
    } catch (error) {
      console.error('Create client error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'CREATE_CLIENT_ERROR'
      });
    }
  };

  /**
   * GET /api/v1/clients
   * List all client applications for authenticated user
   */
  public listClients = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          error: 'User authentication required',
          code: 'USER_REQUIRED'
        });
        return;
      }

      const clients = await prisma.clientApplication.findMany({
        where: { createdBy: userId },
        select: {
          id: true,
          clientId: true,
          name: true,
          description: true,
          redirectUris: true,
          allowedScopes: true,
          defaultScopes: true,
          skipConsent: true,
          isActive: true,
          logoUrl: true,
          homepageUrl: true,
          privacyPolicyUrl: true,
          tosUrl: true,
          createdAt: true,
          updatedAt: true,
          // Don't include secret in list view
          secret: false,
          creator: {
            select: {
              id: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Parse JSON fields for each client
      const clientsWithParsedFields = clients.map(client => ({
        ...client,
        redirectUris: JSON.parse(client.redirectUris),
        allowedScopes: JSON.parse(client.allowedScopes),
        defaultScopes: JSON.parse(client.defaultScopes)
      }));

      res.status(200).json({
        success: true,
        data: clientsWithParsedFields
      });
    } catch (error) {
      console.error('List clients error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'LIST_CLIENTS_ERROR'
      });
    }
  };

  /**
   * GET /api/v1/clients/:id
   * Get a specific client application
   */
  public getClient = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          error: 'User authentication required',
          code: 'USER_REQUIRED'
        });
        return;
      }

      const client = await prisma.clientApplication.findFirst({
        where: { id, createdBy: userId },
        select: {
          id: true,
          clientId: true,
          name: true,
          description: true,
          redirectUris: true,
          allowedScopes: true,
          defaultScopes: true,
          skipConsent: true,
          isActive: true,
          logoUrl: true,
          homepageUrl: true,
          privacyPolicyUrl: true,
          tosUrl: true,
          createdAt: true,
          updatedAt: true,
          // Don't include secret
          secret: false,
          creator: {
            select: {
              id: true,
              email: true,
              role: true
            }
          }
        }
      });

      if (!client) {
        res.status(404).json({
          error: 'Client application not found',
          code: 'CLIENT_NOT_FOUND'
        });
        return;
      }

      // Parse JSON fields
      const clientWithParsedFields = {
        ...client,
        redirectUris: JSON.parse(client.redirectUris),
        allowedScopes: JSON.parse(client.allowedScopes),
        defaultScopes: JSON.parse(client.defaultScopes)
      };

      res.status(200).json({
        success: true,
        data: clientWithParsedFields
      });
    } catch (error) {
      console.error('Get client error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'GET_CLIENT_ERROR'
      });
    }
  };

  /**
   * PUT /api/v1/clients/:id
   * Update a client application
   */
  public updateClient = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
        return;
      }

      const { id } = req.params;
      const { 
        name, 
        description, 
        redirectUris, 
        allowedScopes, 
        defaultScopes,
        skipConsent,
        logoUrl,
        homepageUrl,
        privacyPolicyUrl,
        tosUrl,
        isActive
      } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          error: 'User authentication required',
          code: 'USER_REQUIRED'
        });
        return;
      }

      // Check if client exists and belongs to user
      const existingClient = await prisma.clientApplication.findFirst({
        where: { id, createdBy: userId }
      });

      if (!existingClient) {
        res.status(404).json({
          error: 'Client application not found',
          code: 'CLIENT_NOT_FOUND'
        });
        return;
      }

      // Update client
      const updatedClient = await prisma.clientApplication.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(redirectUris && { redirectUris: JSON.stringify(redirectUris) }),
          ...(allowedScopes && { allowedScopes: JSON.stringify(allowedScopes) }),
          ...(defaultScopes && { defaultScopes: JSON.stringify(defaultScopes) }),
          ...(skipConsent !== undefined && { skipConsent }),
          ...(logoUrl !== undefined && { logoUrl }),
          ...(homepageUrl !== undefined && { homepageUrl }),
          ...(privacyPolicyUrl !== undefined && { privacyPolicyUrl }),
          ...(tosUrl !== undefined && { tosUrl }),
          ...(isActive !== undefined && { isActive })
        },
        select: {
          id: true,
          clientId: true,
          name: true,
          description: true,
          redirectUris: true,
          allowedScopes: true,
          defaultScopes: true,
          skipConsent: true,
          isActive: true,
          logoUrl: true,
          homepageUrl: true,
          privacyPolicyUrl: true,
          tosUrl: true,
          createdAt: true,
          updatedAt: true,
          // Don't include secret
          secret: false
        }
      });

      // Parse JSON fields
      const clientWithParsedFields = {
        ...updatedClient,
        redirectUris: JSON.parse(updatedClient.redirectUris),
        allowedScopes: JSON.parse(updatedClient.allowedScopes),
        defaultScopes: JSON.parse(updatedClient.defaultScopes)
      };

      res.status(200).json({
        success: true,
        data: clientWithParsedFields
      });
    } catch (error) {
      console.error('Update client error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'UPDATE_CLIENT_ERROR'
      });
    }
  };

  /**
   * DELETE /api/v1/clients/:id
   * Delete a client application
   */
  public deleteClient = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          error: 'User authentication required',
          code: 'USER_REQUIRED'
        });
        return;
      }

      // Check if client exists and belongs to user
      const existingClient = await prisma.clientApplication.findFirst({
        where: { id, createdBy: userId }
      });

      if (!existingClient) {
        res.status(404).json({
          error: 'Client application not found',
          code: 'CLIENT_NOT_FOUND'
        });
        return;
      }

      // Delete client
      await prisma.clientApplication.delete({
        where: { id }
      });

      res.status(200).json({
        success: true,
        message: 'Client application deleted successfully'
      });
    } catch (error) {
      console.error('Delete client error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'DELETE_CLIENT_ERROR'
      });
    }
  };

  /**
   * POST /api/v1/clients/:id/rotate-secret
   * Rotate client secret (generate new secret, invalidate old one)
   */
  public rotateClientSecret = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          error: 'User authentication required',
          code: 'USER_REQUIRED'
        });
        return;
      }

      // Check if client exists and belongs to user
      const existingClient = await prisma.clientApplication.findFirst({
        where: { id, createdBy: userId }
      });

      if (!existingClient) {
        res.status(404).json({
          error: 'Client application not found',
          code: 'CLIENT_NOT_FOUND'
        });
        return;
      }

      // Generate new secret
      const newSecret = this.generateClientSecret();

      // Update client with new secret
      const updatedClient = await prisma.clientApplication.update({
        where: { id },
        data: { secret: newSecret },
        select: {
          id: true,
          clientId: true,
          name: true,
          secret: true, // Return new secret
          updatedAt: true
        }
      });

      res.status(200).json({
        success: true,
        data: {
          id: updatedClient.id,
          clientId: updatedClient.clientId,
          clientSecret: updatedClient.secret, // Return new secret
          updatedAt: updatedClient.updatedAt
        },
        message: 'Client secret rotated successfully. Save the new secret securely.'
      });
    } catch (error) {
      console.error('Rotate client secret error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'ROTATE_SECRET_ERROR'
      });
    }
  };
}