/**
 * Script de seed pour créer un utilisateur par défaut
 * Inspiré par OPNsense - utilisateur root avec mot de passe identity
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du script de seed...');
  
  try {
    // Vérifier si l'utilisateur root existe déjà
    const existingRoot = await prisma.user.findUnique({
      where: { username: 'root' },
    });
    
    if (existingRoot) {
      console.log('✅ Utilisateur root existe déjà, mise à jour...');
      
      // Mettre à jour l'utilisateur existant
      await prisma.user.update({
        where: { username: 'root' },
        data: {
          email: 'root@identity.local',
          name: 'Root Administrator',
          emailVerified: true,
          isActive: true,
          discordLinked: false,
          totpEnabled: false,
          locale: 'en-US',
          timezone: 'UTC',
          minPermissionLevel: 'superadmin',
          allowedRoles: ['superadmin', 'admin', 'dba', 'security_admin'],
          updatedAt: new Date(),
        },
      });
      
      console.log('✅ Utilisateur root mis à jour avec succès');
    } else {
      console.log('🆕 Création de l\'utilisateur root...');
      
      // Créer l'utilisateur root avec mot de passe "identity" (référence OPNsense)
      const hashedPassword = await bcrypt.hash('identity', 12);
      
      const rootUser = await prisma.user.create({
        data: {
          email: 'root@identity.local',
          username: 'root',
          name: 'Root Administrator',
          passwordHash: hashedPassword,
          passwordSalt: '', // bcrypt gère le sel interne
          emailVerified: true,
          isActive: true,
          lastLoginAt: new Date(),
          discordLinked: false,
          totpEnabled: false,
          locale: 'en-US',
          timezone: 'UTC',
          minPermissionLevel: 'superadmin',
          allowedRoles: ['superadmin', 'admin', 'dba', 'security_admin', 'platform_admin'],
        },
      });
      
      console.log('✅ Utilisateur root créé avec succès:', rootUser.id);
      
      // Créer un profil pour l'utilisateur root
      await prisma.profile.create({
        data: {
          userId: rootUser.id,
          displayName: 'Root Administrator',
          avatarUrl: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
          locale: 'en-US',
          timezone: 'UTC',
          bio: 'System root administrator - OPNsense inspired',
        },
      });
      
      console.log('✅ Profil root créé avec succès');
    }
    
    // Créer une organisation par défaut si elle n'existe pas
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: 'identity-platform' },
    });
    
    if (!existingOrg) {
      console.log('🏢 Création de l\'organisation par défaut...');
      
      const rootUser = await prisma.user.findUnique({
        where: { username: 'root' },
      });
      
      if (rootUser) {
        const org = await prisma.organization.create({
          data: {
            name: 'Identity Platform',
            slug: 'identity-platform',
            description: 'Default organization for Identity Platform',
            website: 'http://identity.local',
            isActive: true,
            plan: 'enterprise',
            storageQuota: 1024,
            storageUsed: 0,
            maxEnvironments: 10,
            databaseCount: 0,
            primaryAdmin: rootUser.id,
            securityContact: rootUser.id,
            billingContact: rootUser.id,
            complianceFrameworks: ['soc2', 'iso27001', 'gdpr'],
            regions: ['global'],
            ownerId: rootUser.id,
          },
        });
        
        console.log('✅ Organisation par défaut créée:', org.id);
        
        // Créer un environnement par défaut
        const env = await prisma.environment.create({
          data: {
            name: 'production',
            type: 'production',
            status: 'healthy',
            region: 'global',
            organizationId: org.id,
            ownerId: rootUser.id,
            ownerTeam: 'platform',
            version: '1.0.0',
            deploymentMode: 'saas',
            cpu: 50.0,
            memory: 75.0,
            storage: 25.0,
            networkLatency: 1.0,
            requestRate: 1000,
            errorRate: 0.0,
            maxUsers: 1000,
            usersUsed: 1,
            maxApiCalls: 1000000,
            apiCallsUsed: 0,
            storageQuota: 100,
            storageUsed: 10,
            encryptionAtRest: true,
            encryptionInTransit: true,
            mfaRequired: true,
            ssoEnabled: true,
            complianceFrameworks: ['soc2', 'iso27001', 'gdpr'],
            lastSecurityScanAt: new Date(),
            vulnerabilities: 0,
            lastDeploymentAt: new Date(),
            lastBackupAt: new Date(),
            lastSecurityAuditAt: new Date(),
            changeCount24h: 0,
            incidentCount30d: 0,
            activeServices: ['auth', 'identity', 'database'],
            databases: ['primary-db'],
            caches: ['redis'],
            messageQueues: ['rabbitmq'],
            externalIdPs: ['google', 'github'],
            tags: ['production', 'default'],
          },
        });
        
        console.log('✅ Environnement de production créé:', env.id);
        
        // Donner à l'utilisateur root l'accès à l'environnement
        await prisma.environmentAccess.create({
          data: {
            userId: rootUser.id,
            environmentId: env.id,
            permissionLevel: 'superadmin',
            grantedBy: rootUser.id,
          },
        });
        
        console.log('✅ Accès environnement configuré pour root');
      }
    }
    
    // Créer des rôles par défaut si ils n'existent pas
    const rolesToCreate = [
      { name: 'superadmin', description: 'Super Administrator with full access' },
      { name: 'admin', description: 'Administrator with elevated privileges' },
      { name: 'dba', description: 'Database Administrator' },
      { name: 'security_admin', description: 'Security Administrator' },
      { name: 'platform_admin', description: 'Platform Administrator' },
      { name: 'developer', description: 'Developer with limited access' },
      { name: 'user', description: 'Regular user' },
      { name: 'viewer', description: 'Read-only access' },
    ];
    
    for (const role of rolesToCreate) {
      const existingRole = await prisma.role.findUnique({
        where: { name: role.name },
      });
      
      if (!existingRole) {
        await prisma.role.create({
          data: {
            name: role.name,
            description: role.description,
            isSystem: true,
          },
        });
        console.log(`✅ Rôle ${role.name} créé`);
      }
    }
    
    // Assigner les rôles à l'utilisateur root
    const rootUser = await prisma.user.findUnique({
      where: { username: 'root' },
    });
    
    if (rootUser) {
      const allRoles = await prisma.role.findMany();
      
      for (const role of allRoles) {
        const existingUserRole = await prisma.userRole.findUnique({
          where: {
            userId_roleId: {
              userId: rootUser.id,
              roleId: role.id,
            },
          },
        });
        
        if (!existingUserRole) {
          await prisma.userRole.create({
            data: {
              userId: rootUser.id,
              roleId: role.id,
              assignedBy: rootUser.id,
            },
          });
          console.log(`✅ Rôle ${role.name} assigné à root`);
        }
      }
    }
    
    console.log('🎉 Script de seed terminé avec succès !');
    console.log('📋 Informations de connexion:');
    console.log('   Username: root');
    console.log('   Password: identity');
    console.log('   Email: root@identity.local');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution du script de seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Déconnexion de la base de données');
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

export { main };