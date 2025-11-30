import { Request, Response } from 'express';
import { rbacService } from '../services/rbacService';
import { prisma } from '../config/database';

export class RoleController {
  /**
   * Create a new role
   */
  async createRole(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, permissions, isSystem } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Check permissions
      const hasPermission = await rbacService.hasPermission(userId, 'roles:write');
      if (!hasPermission) {
        res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        return;
      }

      // Validate required fields
      if (!name || !description || !Array.isArray(permissions)) {
        res.status(400).json({ 
          error: 'Bad Request',
          message: 'Name, description, and permissions array are required'
        });
        return;
      }

      // Check if role name already exists
      const existingRole = await prisma.role.findUnique({
        where: { name }
      });

      if (existingRole) {
        res.status(409).json({ error: 'Conflict', message: 'Role name already exists' });
        return;
      }

      const role = await rbacService.createRole({
        name,
        description,
        permissions,
        isSystem
      }, userId);

      res.status(201).json({
        success: true,
        role
      });

    } catch (error) {
      console.error('Create role error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create role'
      });
    }
  }

  /**
   * Update an existing role
   */
  async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, permissions, isActive } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Check permissions
      const hasPermission = await rbacService.hasPermission(userId, 'roles:write');
      if (!hasPermission) {
        res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        return;
      }

      // Check if role exists
      const existingRole = await prisma.role.findUnique({
        where: { id }
      });

      if (!existingRole) {
        res.status(404).json({ error: 'Role not found' });
        return;
      }

      // Prevent modification of system roles by non-super admins
      if (existingRole.isSystem) {
        const isSuperAdmin = await rbacService.hasPermission(userId, 'admin:access');
        if (!isSuperAdmin) {
          res.status(403).json({ error: 'Cannot modify system roles' });
          return;
        }
      }

      const role = await rbacService.updateRole(id, {
        name,
        description,
        permissions,
        isActive
      });

      res.json({
        success: true,
        role
      });

    } catch (error) {
      console.error('Update role error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update role'
      });
    }
  }

  /**
   * Delete a role
   */
  async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Check permissions
      const hasPermission = await rbacService.hasPermission(userId, 'roles:delete');
      if (!hasPermission) {
        res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        return;
      }

      await rbacService.deleteRole(id);

      res.json({
        success: true,
        message: 'Role deleted successfully'
      });

    } catch (error) {
      console.error('Delete role error:', error);
      if (error instanceof Error && error.message === 'Cannot delete system roles') {
        res.status(403).json({ error: 'Cannot delete system roles' });
      } else {
        res.status(500).json({
          error: 'Internal Server Error',
          message: 'Failed to delete role'
        });
      }
    }
  }

  /**
   * Get role by ID
   */
  async getRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Check permissions
      const hasPermission = await rbacService.hasPermission(userId, 'roles:read');
      if (!hasPermission) {
        res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        return;
      }

      const role = await rbacService.getRole(id);

      if (!role) {
        res.status(404).json({ error: 'Role not found' });
        return;
      }

      res.json({
        success: true,
        role
      });

    } catch (error) {
      console.error('Get role error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get role'
      });
    }
  }

  /**
   * List all roles
   */
  async listRoles(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Check permissions
      const hasPermission = await rbacService.hasPermission(userId, 'roles:read');
      if (!hasPermission) {
        res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        return;
      }

      const filters: any = {};
      
      if (req.query.isActive !== undefined) {
        filters.isActive = req.query.isActive === 'true';
      }
      
      if (req.query.isSystem !== undefined) {
        filters.isSystem = req.query.isSystem === 'true';
      }

      const roles = await rbacService.listRoles(filters);

      res.json({
        success: true,
        roles,
        count: roles.length
      });

    } catch (error) {
      console.error('List roles error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to list roles'
      });
    }
  }

  /**
   * Assign role to user
   */
  async assignRole(req: Request, res: Response): Promise<void> {
    try {
      const { userId, roleId, expiresAt } = req.body;
      const assignedBy = (req as any).user?.id;

      if (!assignedBy) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Check permissions
      const hasPermission = await rbacService.hasPermission(assignedBy, 'users:write');
      if (!hasPermission) {
        res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        return;
      }

      // Validate required fields
      if (!userId || !roleId) {
        res.status(400).json({ 
          error: 'Bad Request',
          message: 'User ID and Role ID are required'
        });
        return;
      }

      // Validate expiration date if provided
      if (expiresAt && new Date(expiresAt) <= new Date()) {
        res.status(400).json({ 
          error: 'Bad Request',
          message: 'Expiration date must be in the future'
        });
        return;
      }

      const assignment = await rbacService.assignRoleToUser({
        userId,
        roleId,
        assignedBy,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined
      });

      res.status(201).json({
        success: true,
        assignment
      });

    } catch (error) {
      console.error('Assign role error:', error);
      if (error instanceof Error && error.message === 'User already has this role') {
        res.status(409).json({ error: 'User already has this role' });
      } else {
        res.status(500).json({
          error: 'Internal Server Error',
          message: 'Failed to assign role'
        });
      }
    }
  }

  /**
   * Remove role from user
   */
  async removeRole(req: Request, res: Response): Promise<void> {
    try {
      const { userId, roleId } = req.params;
      const currentUserId = (req as any).user?.id;

      if (!currentUserId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Check permissions (users can remove their own roles or need admin permissions)
      const hasPermission = userId === currentUserId || 
                         await rbacService.hasPermission(currentUserId, 'users:write');
      
      if (!hasPermission) {
        res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        return;
      }

      await rbacService.removeRoleFromUser(userId, roleId);

      res.json({
        success: true,
        message: 'Role removed from user successfully'
      });

    } catch (error) {
      console.error('Remove role error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to remove role'
      });
    }
  }

  /**
   * Get user roles
   */
  async getUserRoles(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const currentUserId = (req as any).user?.id;

      if (!currentUserId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Users can view their own roles or need admin permissions
      const hasPermission = userId === currentUserId || 
                         await rbacService.hasPermission(currentUserId, 'users:read');
      
      if (!hasPermission) {
        res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        return;
      }

      const userRoles = await rbacService.getUserRoles(userId);

      res.json({
        success: true,
        userRoles
      });

    } catch (error) {
      console.error('Get user roles error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get user roles'
      });
    }
  }

  /**
   * Get users with specific role
   */
  async getUsersWithRole(req: Request, res: Response): Promise<void> {
    try {
      const { roleId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Check permissions
      const hasPermission = await rbacService.hasPermission(userId, 'users:read');
      if (!hasPermission) {
        res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        return;
      }

      const users = await rbacService.getUsersWithRole(roleId);

      res.json({
        success: true,
        users,
        count: users.length
      });

    } catch (error) {
      console.error('Get users with role error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get users with role'
      });
    }
  }

  /**
   * Initialize system roles
   */
  async initializeSystemRoles(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Only super admins can initialize system roles
      const isSuperAdmin = await rbacService.hasPermission(userId, 'admin:access');
      if (!isSuperAdmin) {
        res.status(403).json({ error: 'Forbidden - Super admin access required' });
        return;
      }

      await rbacService.initializeSystemRoles();

      res.json({
        success: true,
        message: 'System roles initialized successfully'
      });

    } catch (error) {
      console.error('Initialize system roles error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to initialize system roles'
      });
    }
  }

  /**
   * Get RBAC statistics
   */
  async getRBACStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Check permissions
      const hasPermission = await rbacService.hasPermission(userId, 'admin:access');
      if (!hasPermission) {
        res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        return;
      }

      const stats = await rbacService.getRBACStats();

      res.json({
        success: true,
        stats
      });

    } catch (error) {
      console.error('Get RBAC stats error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get RBAC statistics'
      });
    }
  }
}