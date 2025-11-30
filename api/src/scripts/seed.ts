import { PrismaClient } from '@prisma/client';
import { config, prisma } from '../config/database';
import bcrypt from 'bcryptjs';



export class SeedManager {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = prisma;
  }

  /**
   * Check if seed data already exists
   */
  async needsSeeding(): Promise<boolean> {
    try {
      const userCount = await this.prismaClient.user.count();
      return userCount === 0;
    } catch (error) {
      console.log('⚠️ Could not check if seeding is needed, assuming it is');
      return true;
    }
  }

  /**
   * Create seed data for development
   */
  async seedDevelopment(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🌱 Seeding development database...');

      // Create permissions
      const permissions = await this.createPermissions();
      console.log(`✅ Created ${permissions.length} permissions`);

      // Create roles
      const roles = await this.createRoles();
      console.log(`✅ Created ${roles.length} roles`);

      // Create admin user
      const adminUser = await this.createAdminUser();
      console.log('✅ Created admin user');

      // Create test organization
      const organization = await this.createTestOrganization(adminUser.id);
      console.log('✅ Created test organization');

      // Create test projects
      await this.createTestProjects(organization.id, adminUser.id);
      console.log('✅ Created test projects');

      console.log('🎉 Development seeding completed successfully');
      return {
        success: true,
        message: 'Development seeding completed successfully',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown seeding error';
      console.error('❌ Development seeding failed:', errorMessage);
      return {
        success: false,
        message: `Development seeding failed: ${errorMessage}`,
      };
    }
  }

  /**
   * Create minimal seed data for production
   */
  async seedProduction(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🌱 Seeding production database with essential data...');

      // Create permissions
      const permissions = await this.createPermissions();
      console.log(`✅ Created ${permissions.length} permissions`);

      // Create roles
      const roles = await this.createRoles();
      console.log(`✅ Created ${roles.length} roles`);

      // Create default admin user if environment variables are provided
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (adminEmail && adminPassword) {
        const adminUser = await this.createAdminUser(adminEmail, adminPassword);
        console.log('✅ Created admin user from environment variables');
      } else {
        console.log('⚠️ No admin credentials provided in environment variables');
      }

      console.log('🎉 Production seeding completed successfully');
      return {
        success: true,
        message: 'Production seeding completed successfully',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown seeding error';
      console.error('❌ Production seeding failed:', errorMessage);
      return {
        success: false,
        message: `Production seeding failed: ${errorMessage}`,
      };
    }
  }

  /**
   * Auto-seed based on environment
   */
  async autoSeed(): Promise<{ success: boolean; message: string }> {
    const needsSeeding = await this.needsSeeding();
    
    if (!needsSeeding) {
      return {
        success: true,
        message: 'Database already contains data, skipping seeding',
      };
    }

    if (config.nodeEnv === 'production') {
      return await this.seedProduction();
    } else {
      return await this.seedDevelopment();
    }
  }

  /**
   * Create permissions
   */
  private async createPermissions() {
    const permissions = [
      // User management
      { name: 'users.read', description: 'Read user information', resource: 'user', action: 'read', category: 'users' },
      { name: 'users.write', description: 'Create and update users', resource: 'user', action: 'write', category: 'users' },
      { name: 'users.delete', description: 'Delete users', resource: 'user', action: 'delete', category: 'users' },
      
      // Organization management
      { name: 'organizations.read', description: 'Read organization information', resource: 'organization', action: 'read', category: 'organizations' },
      { name: 'organizations.write', description: 'Create and update organizations', resource: 'organization', action: 'write', category: 'organizations' },
      { name: 'organizations.delete', description: 'Delete organizations', resource: 'organization', action: 'delete', category: 'organizations' },
      
      // Project management
      { name: 'projects.read', description: 'Read project information', resource: 'project', action: 'read', category: 'projects' },
      { name: 'projects.write', description: 'Create and update projects', resource: 'project', action: 'write', category: 'projects' },
      { name: 'projects.delete', description: 'Delete projects', resource: 'project', action: 'delete', category: 'projects' },
      
      // Role management
      { name: 'roles.read', description: 'Read role information', resource: 'role', action: 'read', category: 'roles' },
      { name: 'roles.write', description: 'Create and update roles', resource: 'role', action: 'write', category: 'roles' },
      { name: 'roles.delete', description: 'Delete roles', resource: 'role', action: 'delete', category: 'roles' },
      
      // System administration
      { name: 'system.admin', description: 'Full system administration', resource: 'system', action: 'admin', category: 'system' },
    ];

    const createdPermissions = [];
    for (const permission of permissions) {
      const created = await this.prismaClient.permission.upsert({
        where: { name: permission.name },
        update: permission,
        create: permission,
      });
      createdPermissions.push(created);
    }

    return createdPermissions;
  }

  /**
   * Create roles
   */
  private async createRoles() {
    const roles = [
      {
        name: 'SUPER_ADMIN',
        description: 'Super administrator with full system access',
        permissions: JSON.stringify(['*']), // All permissions
        isSystem: true,
      },
      {
        name: 'ADMIN',
        description: 'Administrator with organization-level access',
        permissions: JSON.stringify([
          'users.read', 'users.write',
          'organizations.read', 'organizations.write',
          'projects.read', 'projects.write',
          'roles.read',
        ]),
        isSystem: true,
      },
      {
        name: 'MANAGER',
        description: 'Manager with project-level access',
        permissions: JSON.stringify([
          'users.read',
          'organizations.read',
          'projects.read', 'projects.write',
        ]),
        isSystem: true,
      },
      {
        name: 'USER',
        description: 'Regular user with basic access',
        permissions: JSON.stringify([
          'users.read',
          'organizations.read',
          'projects.read',
        ]),
        isSystem: true,
      },
    ];

    const createdRoles = [];
    for (const role of roles) {
      const created = await this.prismaClient.role.upsert({
        where: { name: role.name },
        update: role,
        create: role,
      });
      createdRoles.push(created);
    }

    return createdRoles;
  }

  /**
   * Create admin user
   */
  private async createAdminUser(email?: string, password?: string) {
    const adminEmail = email || 'admin@aether-identity.com';
    const adminPassword = password || 'admin123456';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const user = await this.prismaClient.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
        profile: {
          create: {
            firstName: 'Super',
            lastName: 'Admin',
          },
        },
      },
    });

    // Assign SUPER_ADMIN role
    const superAdminRole = await this.prismaClient.role.findUnique({
      where: { name: 'SUPER_ADMIN' },
    });

    if (superAdminRole) {
      await this.prismaClient.userRole.create({
        data: {
          userId: user.id,
          roleId: superAdminRole.id,
        },
      });
    }

    return user;
  }

  /**
   * Create test organization
   */
  private async createTestOrganization(adminUserId: string) {
    return await this.prismaClient.organization.create({
      data: {
        name: 'Aether Identity Test',
        slug: 'aether-identity-test',
        description: 'Test organization for development',
        website: 'https://aether-identity.com',
        memberships: {
          create: {
            userId: adminUserId,
            role: 'ADMIN',
          },
        },
      },
    });
  }

  /**
   * Create test projects
   */
  private async createTestProjects(organizationId: string, adminUserId: string) {
    const projects = [
      {
        name: 'Identity Management',
        slug: 'identity-management',
        description: 'Core identity management system',
        key: 'IDM',
        priority: 'HIGH',
      },
      {
        name: 'Access Control',
        slug: 'access-control',
        description: 'Role-based access control system',
        key: 'RBAC',
        priority: 'HIGH',
      },
      {
        name: 'Audit System',
        slug: 'audit-system',
        description: 'Comprehensive audit logging system',
        key: 'AUDIT',
        priority: 'MEDIUM',
      },
    ];

    for (const project of projects) {
      await this.prismaClient.project.create({
        data: {
          ...project,
          organizationId,
          createdBy: adminUserId,
          members: {
            create: {
              userId: adminUserId,
              role: 'ADMIN',
            },
          },
        },
      });
    }
  }

  /**
   * Clear all seed data (development only)
   */
  async clearSeedData(): Promise<{ success: boolean; message: string }> {
    if (config.nodeEnv === 'production') {
      return {
        success: false,
        message: 'Clearing seed data is not allowed in production',
      };
    }

    try {
      console.log('🧹 Clearing seed data...');

      // Delete in order of dependencies
      await this.prismaClient.projectMember.deleteMany();
      await this.prismaClient.project.deleteMany();
      await this.prismaClient.membership.deleteMany();
      await this.prismaClient.organization.deleteMany();
      await this.prismaClient.userRole.deleteMany();
      await this.prismaClient.userProfile.deleteMany();
      await this.prismaClient.user.deleteMany();
      await this.prismaClient.rolePermission.deleteMany();
      await this.prismaClient.role.deleteMany();
      await this.prismaClient.permission.deleteMany();

      console.log('✅ Seed data cleared successfully');
      return {
        success: true,
        message: 'Seed data cleared successfully',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to clear seed data:', errorMessage);
      return {
        success: false,
        message: `Failed to clear seed data: ${errorMessage}`,
      };
    }
  }
}

// Export singleton instance
export const seedManager = new SeedManager();