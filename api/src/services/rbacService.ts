import { prisma } from '../config/database';

export interface RoleData {
  name: string;
  description: string;
  permissions: string[];
  isSystem?: boolean;
}

export interface PermissionData {
  name: string;
  description: string;
  resource: string;
  action: string;
  category: string;
}

export interface UserRoleAssignment {
  userId: string;
  roleId: string;
  assignedBy?: string;
  expiresAt?: Date;
  isActive?: boolean;
}

export class RBACService {
  /**
   * Create a new role
   */
  async createRole(data: RoleData, createdBy: string): Promise<any> {
    return await prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        permissions: JSON.stringify(data.permissions),
        isSystem: data.isSystem || false,
        isActive: true
      }
    });
  }

  /**
   * Update an existing role
   */
  async updateRole(roleId: string, data: Partial<RoleData> & { isActive?: boolean }): Promise<any> {
    const updateData: any = { ...data };
    
    if (data.permissions) {
      updateData.permissions = JSON.stringify(data.permissions);
    }

    return await prisma.role.update({
      where: { id: roleId },
      data: updateData
    });
  }

  /**
   * Delete a role (if not system role)
   */
  async deleteRole(roleId: string): Promise<void> {
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    });

    if (!role) {
      throw new Error('Role not found');
    }

    if (role.isSystem) {
      throw new Error('Cannot delete system roles');
    }

    await prisma.role.delete({
      where: { id: roleId }
    });
  }

  /**
   * Get role by ID
   */
  async getRole(roleId: string): Promise<any> {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        rolePermissions: {
          include: { permission: true }
        },
        userRoles: {
          include: {
            user: {
              select: { id: true, email: true, profile: true }
            }
          }
        },
        _count: {
          select: { userRoles: true }
        }
      }
    });

    if (!role) return null;

    return {
      ...role,
      permissions: JSON.parse(role.permissions),
      userCount: role._count.userRoles
    };
  }

  /**
   * List all roles
   */
  async listRoles(filters?: {
    isActive?: boolean;
    isSystem?: boolean;
    category?: string;
  }): Promise<any[]> {
    const where: any = {};
    
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    
    if (filters?.isSystem !== undefined) {
      where.isSystem = filters.isSystem;
    }

    const roles = await prisma.role.findMany({
      where,
      include: {
        _count: {
          select: { userRoles: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return roles.map(role => ({
      ...role,
      permissions: JSON.parse(role.permissions),
      userCount: role._count.userRoles
    }));
  }

  /**
   * Create a new permission
   */
  async createPermission(data: PermissionData): Promise<any> {
    return await prisma.permission.create({
      data: {
        name: data.name,
        description: data.description,
        resource: data.resource,
        action: data.action,
        category: data.category,
        isActive: true
      }
    });
  }

  /**
   * Update permission
   */
  async updatePermission(permissionId: string, data: Partial<PermissionData>): Promise<any> {
    return await prisma.permission.update({
      where: { id: permissionId },
      data
    });
  }

  /**
   * Delete permission
   */
  async deletePermission(permissionId: string): Promise<void> {
    await prisma.permission.delete({
      where: { id: permissionId }
    });
  }

  /**
   * Get permission by ID
   */
  async getPermission(permissionId: string): Promise<any> {
    return await prisma.permission.findUnique({
      where: { id: permissionId },
      include: {
        rolePermissions: {
          include: {
            role: true
          }
        },
        _count: {
          select: { rolePermissions: true }
        }
      }
    });
  }

  /**
   * List all permissions
   */
  async listPermissions(filters?: {
    resource?: string;
    category?: string;
    isActive?: boolean;
  }): Promise<any[]> {
    const where: any = {};
    
    if (filters?.resource) {
      where.resource = filters.resource;
    }
    
    if (filters?.category) {
      where.category = filters.category;
    }
    
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return await prisma.permission.findMany({
      where,
      orderBy: { category: 'asc' }
    });
  }

  /**
   * Assign role to user
   */
  async assignRoleToUser(assignment: UserRoleAssignment): Promise<any> {
    // Check if assignment already exists
    const existing = await prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId: assignment.userId,
          roleId: assignment.roleId
        }
      }
    });

    if (existing) {
      throw new Error('User already has this role');
    }

    return await prisma.userRole.create({
      data: {
        userId: assignment.userId,
        roleId: assignment.roleId,
        assignedBy: assignment.assignedBy,
        expiresAt: assignment.expiresAt,
        isActive: true
      }
    });
  }

  /**
   * Remove role from user
   */
  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    await prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId
        }
      }
    });
  }

  /**
   * Update user role assignment
   */
  async updateUserRole(userId: string, roleId: string, data: Partial<UserRoleAssignment>): Promise<any> {
    return await prisma.userRole.update({
      where: {
        userId_roleId: {
          userId,
          roleId
        }
      },
      data: {
        assignedBy: data.assignedBy,
        expiresAt: data.expiresAt,
        isActive: data.isActive
      }
    });
  }

  /**
   * Get user roles and permissions
   */
  async getUserRoles(userId: string): Promise<{
    roles: any[];
    permissions: string[];
    effectivePermissions: string[];
  }> {
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true }
            }
          }
        }
      }
    });

    const roles = userRoles.map(ur => ur.role);
    const permissions = new Set<string>();
    const effectivePermissions = new Set<string>();

    for (const userRole of userRoles) {
      const role = userRole.role;
      
      // Add role permissions
      const rolePermissions = JSON.parse(role.permissions);
      rolePermissions.forEach((perm: string) => permissions.add(perm));
      
      // Add granular permissions
      role.rolePermissions.forEach(rp => {
        if (rp.permission.isActive) {
          permissions.add(rp.permission.name);
          effectivePermissions.add(`${rp.permission.resource}:${rp.permission.action}`);
        }
      });
    }

    return {
      roles,
      permissions: Array.from(permissions),
      effectivePermissions: Array.from(effectivePermissions)
    };
  }

  /**
   * Check if user has specific permission
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const { permissions, effectivePermissions } = await this.getUserRoles(userId);
    
    return permissions.includes(permission) || 
           effectivePermissions.includes(permission) ||
           effectivePermissions.some(perm => permission.startsWith(perm.replace('*', '')));
  }

  /**
   * Check if user has any of the specified permissions
   */
  async hasAnyPermission(userId: string, permissions: string[]): Promise<boolean> {
    const userPerms = await this.getUserRoles(userId);
    
    return permissions.some(perm => 
      userPerms.permissions.includes(perm) ||
      userPerms.effectivePermissions.includes(perm) ||
      userPerms.effectivePermissions.some(userPerm => perm.startsWith(userPerm.replace('*', '')))
    );
  }

  /**
   * Check if user has all specified permissions
   */
  async hasAllPermissions(userId: string, permissions: string[]): Promise<boolean> {
    const userPerms = await this.getUserRoles(userId);
    
    return permissions.every(perm => 
      userPerms.permissions.includes(perm) ||
      userPerms.effectivePermissions.includes(perm) ||
      userPerms.effectivePermissions.some(userPerm => perm.startsWith(userPerm.replace('*', '')))
    );
  }

  /**
   * Get users with specific role
   */
  async getUsersWithRole(roleId: string): Promise<any[]> {
    return await prisma.userRole.findMany({
      where: {
        roleId,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            status: true,
            profile: true
          }
        }
      },
      orderBy: { assignedAt: 'desc' }
    });
  }

  /**
   * Initialize default system roles and permissions
   */
  async initializeSystemRoles(): Promise<void> {
    // Create default permissions
    const defaultPermissions = [
      // User management
      { name: 'users:read', description: 'Read user information', resource: 'users', action: 'read', category: 'User Management' },
      { name: 'users:write', description: 'Create and update users', resource: 'users', action: 'write', category: 'User Management' },
      { name: 'users:delete', description: 'Delete users', resource: 'users', action: 'delete', category: 'User Management' },
      
      // Role management
      { name: 'roles:read', description: 'Read roles and permissions', resource: 'roles', action: 'read', category: 'Role Management' },
      { name: 'roles:write', description: 'Create and update roles', resource: 'roles', action: 'write', category: 'Role Management' },
      { name: 'roles:delete', description: 'Delete roles', resource: 'roles', action: 'delete', category: 'Role Management' },
      
      // Organization management
      { name: 'organizations:read', description: 'Read organization information', resource: 'organizations', action: 'read', category: 'Organization Management' },
      { name: 'organizations:write', description: 'Create and update organizations', resource: 'organizations', action: 'write', category: 'Organization Management' },
      { name: 'organizations:delete', description: 'Delete organizations', resource: 'organizations', action: 'delete', category: 'Organization Management' },
      
      // Client application management
      { name: 'clients:read', description: 'Read OAuth2 clients', resource: 'clients', action: 'read', category: 'Client Management' },
      { name: 'clients:write', description: 'Create and update OAuth2 clients', resource: 'clients', action: 'write', category: 'Client Management' },
      { name: 'clients:delete', description: 'Delete OAuth2 clients', resource: 'clients', action: 'delete', category: 'Client Management' },
      
      // Webhook management
      { name: 'webhooks:read', description: 'Read webhooks', resource: 'webhooks', action: 'read', category: 'Webhook Management' },
      { name: 'webhooks:write', description: 'Create and update webhooks', resource: 'webhooks', action: 'write', category: 'Webhook Management' },
      { name: 'webhooks:delete', description: 'Delete webhooks', resource: 'webhooks', action: 'delete', category: 'Webhook Management' },
      
      // System administration
      { name: 'admin:access', description: 'Access admin panel', resource: 'admin', action: 'access', category: 'System Administration' },
      { name: 'audit:read', description: 'Read audit logs', resource: 'audit', action: 'read', category: 'System Administration' },
      { name: 'system:configure', description: 'Configure system settings', resource: 'system', action: 'configure', category: 'System Administration' }
    ];

    for (const permData of defaultPermissions) {
      const existing = await prisma.permission.findUnique({
        where: { name: permData.name }
      });

      if (!existing) {
        await prisma.permission.create({
          data: {
            ...permData,
            isActive: true
          }
        });
      }
    }

    // Create default system roles
    const defaultRoles = [
      {
        name: 'SUPER_ADMIN',
        description: 'Super administrator with full system access',
        permissions: defaultPermissions.map(p => p.name),
        isSystem: true
      },
      {
        name: 'ADMIN',
        description: 'Administrator with most system permissions',
        permissions: defaultPermissions.filter(p => !p.name.includes('SUPER_ADMIN')).map(p => p.name),
        isSystem: true
      },
      {
        name: 'MANAGER',
        description: 'Manager with limited administrative permissions',
        permissions: [
          'users:read', 'users:write',
          'organizations:read', 'organizations:write',
          'clients:read', 'clients:write',
          'webhooks:read', 'webhooks:write'
        ],
        isSystem: true
      },
      {
        name: 'USER',
        description: 'Regular user with basic permissions',
        permissions: [
          'users:read',
          'organizations:read'
        ],
        isSystem: true
      }
    ];

    for (const roleData of defaultRoles) {
      const existing = await prisma.role.findUnique({
        where: { name: roleData.name }
      });

      if (!existing) {
        await prisma.role.create({
          data: {
            ...roleData,
            permissions: JSON.stringify(roleData.permissions),
            isActive: true
          }
        });
      }
    }

    console.log('System roles and permissions initialized');
  }

  /**
   * Get RBAC statistics
   */
  async getRBACStats(): Promise<any> {
    const [
      totalRoles,
      activeRoles,
      systemRoles,
      totalPermissions,
      activePermissions,
      totalUserRoles,
      activeUserRoles
    ] = await Promise.all([
      prisma.role.count(),
      prisma.role.count({ where: { isActive: true } }),
      prisma.role.count({ where: { isSystem: true } }),
      prisma.permission.count(),
      prisma.permission.count({ where: { isActive: true } }),
      prisma.userRole.count(),
      prisma.userRole.count({ 
        where: { 
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        }
      })
    ]);

    return {
      roles: {
        total: totalRoles,
        active: activeRoles,
        system: systemRoles
      },
      permissions: {
        total: totalPermissions,
        active: activePermissions
      },
      userRoles: {
        total: totalUserRoles,
        active: activeUserRoles
      }
    };
  }
}

export const rbacService = new RBACService();