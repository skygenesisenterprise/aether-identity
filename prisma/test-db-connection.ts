/**
 * Script de test pour vérifier la connexion à la base de données
 * et valider le schéma Prisma
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log('🔄 Test de connexion à la base de données...');
  
  try {
    // Test 1: Connexion simple
    await prisma.$connect();
    console.log('✅ Connexion à la base de données établie avec succès');
    
    // Test 2: Créer un utilisateur de test
    console.log('📝 Création d\'un utilisateur de test...');
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
        emailVerified: true,
        isActive: true,
        locale: 'en-US',
        timezone: 'UTC',
        minPermissionLevel: 'viewer',
        allowedRoles: ['user'],
      },
    });
    console.log('✅ Utilisateur créé avec succès:', testUser.id);
    
    // Test 3: Lire l'utilisateur créé
    console.log('🔍 Lecture de l\'utilisateur créé...');
    const foundUser = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: { profile: true },
    });
    console.log('✅ Utilisateur retrouvé:', foundUser?.email);
    
    // Test 4: Créer une organisation de test
    console.log('🏢 Création d\'une organisation de test...');
    const testOrg = await prisma.organization.create({
      data: {
        name: 'Test Organization',
        slug: 'test-org',
        description: 'Organization for testing purposes',
        isActive: true,
        plan: 'free',
        storageQuota: 100,
        storageUsed: 0,
        maxEnvironments: 1,
        databaseCount: 0,
        primaryAdmin: testUser.id,
        securityContact: testUser.id,
        billingContact: testUser.id,
        complianceFrameworks: ['soc2'],
        regions: ['us-east-1'],
        ownerId: testUser.id,
      },
    });
    console.log('✅ Organisation créée avec succès:', testOrg.id);
    
    // Test 5: Créer un environnement de test
    console.log('🌍 Création d\'un environnement de test...');
    const testEnv = await prisma.environment.create({
      data: {
        name: 'test-environment',
        type: 'development',
        status: 'healthy',
        region: 'us-east-1',
        organizationId: testOrg.id,
        ownerId: testUser.id,
        ownerTeam: 'development',
        version: '1.0.0',
        deploymentMode: 'saas',
        cpu: 10.5,
        memory: 25.5,
        storage: 5.0,
        networkLatency: 1.2,
        requestRate: 100,
        errorRate: 0.0,
        maxUsers: 10,
        usersUsed: 1,
        maxApiCalls: 1000,
        apiCallsUsed: 10,
        storageQuota: 10,
        storageUsed: 1,
        encryptionAtRest: true,
        encryptionInTransit: true,
        mfaRequired: false,
        ssoEnabled: false,
        complianceFrameworks: ['soc2'],
        lastSecurityScanAt: new Date(),
        vulnerabilities: 0,
        lastDeploymentAt: new Date(),
        lastBackupAt: new Date(),
        lastSecurityAuditAt: new Date(),
        changeCount24h: 0,
        incidentCount30d: 0,
        activeServices: ['auth', 'identity'],
        databases: ['test-db'],
        caches: ['redis'],
        messageQueues: ['rabbitmq'],
        externalIdPs: ['google'],
        tags: ['test', 'development'],
      },
    });
    console.log('✅ Environnement créé avec succès:', testEnv.id);
    
    // Test 6: Créer une base de données de test
    console.log('💾 Création d\'une base de données de test...');
    const testDb = await prisma.database.create({
      data: {
        name: 'test-database',
        displayName: 'Test Database',
        engine: 'postgresql',
        version: '16.2',
        role: 'primary',
        status: 'healthy',
        environment: 'development',
        region: 'us-east-1',
        organizationId: testOrg.id,
        host: 'localhost',
        port: 5432,
        activeConnections: 5,
        maxConnections: 20,
        waitingConnections: 0,
        storageUsed: 1,
        storageTotal: 10,
        storageGrowthRate: 0.5,
        latency: 1.0,
        throughput: 100,
        errorRate: 0.0,
        slowQueries: 0,
        replicationLag: 0.0,
        replicationStatus: 'unavailable',
        backupEnabled: false,
        backupStrategy: 'manual',
        backupFrequency: 'On-demand',
        backupRetentionDays: 0,
        backupStorageLocation: 'Local',
        backupEncryption: 'none',
        backupIntegrity: 'pending',
        tlsVersion: 'Disabled',
        encryptionAtRest: false,
        authMethod: 'Password Only',
        networkPolicy: 'Localhost Only',
        auditLogging: false,
        vulnerabilities: 0,
        complianceStandards: [],
        minPermissionLevel: 'viewer',
        allowedRoles: ['developer'],
        planRequired: 'free',
        maintenanceWindow: 'Nightly',
      },
    });
    console.log('✅ Base de données créée avec succès:', testDb.id);
    
    // Test 7: Vérifier les relations
    console.log('🔗 Test des relations entre les modèles...');
    const userWithRelations = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: {
        ownedOrganizations: true,
        memberships: true,
        environmentAccess: true,
      },
    });
    
    console.log('✅ Relations vérifiées:', {
      organizations: userWithRelations?.ownedOrganizations.length,
      memberships: userWithRelations?.memberships.length,
      environmentAccess: userWithRelations?.environmentAccess.length,
    });
    
    // Test 8: Nettoyage
    console.log('🧹 Nettoyage des données de test...');
    await prisma.database.delete({ where: { id: testDb.id } });
    await prisma.environment.delete({ where: { id: testEnv.id } });
    await prisma.organization.delete({ where: { id: testOrg.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log('✅ Nettoyage terminé');
    
    console.log('🎉 Tous les tests ont réussi ! La base de données est opérationnelle.');
    
  } catch (error) {
    console.error('❌ Erreur lors du test de la base de données:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Déconnexion de la base de données');
  }
}

// Exécuter le test
if (require.main === module) {
  testDatabaseConnection();
}

export { testDatabaseConnection };