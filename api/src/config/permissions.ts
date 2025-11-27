// Configuration des permissions et rôles pour le système unifié

export interface RoleConfig {
  name: string;
  description: string;
  permissions: string[];
  inherits?: string[]; // Rôles dont ce rôle hérite
}

export interface PermissionConfig {
  name: string;
  description: string;
  resource: string;
  action: string;
  scope?: string;
  category: 'user' | 'organization' | 'application' | 'service' | 'system' | 'billing';
}

// Configuration des rôles
export const ROLES: Record<string, RoleConfig> = {
  owner: {
    name: 'owner',
    description: 'Accès complet à l\'organisation et à toutes les ressources',
    permissions: [
      // Organisation
      'organization:*',
      // Utilisateurs
      'user:*',
      // Applications
      'app:*',
      // Services
      'service:*',
      // Logs
      'logs:*',
      // Facturation
      'billing:*',
      // Système
      'system:*'
    ]
  },
  
  admin: {
    name: 'admin',
    description: 'Accès administrateur avec gestion complète sauf facturation',
    permissions: [
      // Organisation
      'organization:read',
      'organization:write',
      'organization:manage',
      // Utilisateurs
      'user:read',
      'user:write',
      'user:create',
      'user:update',
      'user:delete',
      'user:manage',
      // Applications
      'app:*',
      // Services
      'service:*',
      // Logs
      'logs:*',
      // Système
      'system:read',
      'system:monitor'
    ]
  },
  
  member: {
    name: 'member',
    description: 'Accès membre avec permissions de base',
    permissions: [
      // Organisation
      'organization:read',
      // Utilisateurs
      'user:read',
      'user:profile:own',
      // Applications
      'app:read',
      'app:access',
      // Services
      'service:read',
      'service:access',
      // Logs
      'logs:read',
      'logs:search'
    ]
  },
  
  viewer: {
    name: 'viewer',
    description: 'Accès lecture seule',
    permissions: [
      // Organisation
      'organization:read',
      // Utilisateurs
      'user:read',
      'user:profile:own',
      // Applications
      'app:read',
      // Services
      'service:read',
      // Logs
      'logs:read'
    ]
  }
};

// Configuration des permissions détaillées
export const PERMISSIONS: Record<string, PermissionConfig> = {
  // Permissions Organisation
  'organization:read': {
    name: 'organization:read',
    description: 'Lire les informations de l\'organisation',
    resource: 'organization',
    action: 'read',
    category: 'organization'
  },
  'organization:write': {
    name: 'organization:write',
    description: 'Modifier les informations de l\'organisation',
    resource: 'organization',
    action: 'write',
    category: 'organization'
  },
  'organization:manage': {
    name: 'organization:manage',
    description: 'Gérer complètement l\'organisation',
    resource: 'organization',
    action: 'manage',
    category: 'organization'
  },
  
  // Permissions Utilisateurs
  'user:read': {
    name: 'user:read',
    description: 'Lire les informations des utilisateurs',
    resource: 'user',
    action: 'read',
    category: 'user'
  },
  'user:write': {
    name: 'user:write',
    description: 'Modifier les informations des utilisateurs',
    resource: 'user',
    action: 'write',
    category: 'user'
  },
  'user:create': {
    name: 'user:create',
    description: 'Créer de nouveaux utilisateurs',
    resource: 'user',
    action: 'create',
    category: 'user'
  },
  'user:update': {
    name: 'user:update',
    description: 'Mettre à jour les utilisateurs',
    resource: 'user',
    action: 'update',
    category: 'user'
  },
  'user:delete': {
    name: 'user:delete',
    description: 'Supprimer des utilisateurs',
    resource: 'user',
    action: 'delete',
    category: 'user'
  },
  'user:manage': {
    name: 'user:manage',
    description: 'Gérer complètement les utilisateurs',
    resource: 'user',
    action: 'manage',
    category: 'user'
  },
  'user:profile:own': {
    name: 'user:profile:own',
    description: 'Gérer son propre profil',
    resource: 'user',
    action: 'profile',
    scope: 'own',
    category: 'user'
  },
  
  // Permissions Applications
  'app:read': {
    name: 'app:read',
    description: 'Lire les informations des applications',
    resource: 'app',
    action: 'read',
    category: 'application'
  },
  'app:write': {
    name: 'app:write',
    description: 'Modifier les applications',
    resource: 'app',
    action: 'write',
    category: 'application'
  },
  'app:create': {
    name: 'app:create',
    description: 'Créer de nouvelles applications',
    resource: 'app',
    action: 'create',
    category: 'application'
  },
  'app:delete': {
    name: 'app:delete',
    description: 'Supprimer des applications',
    resource: 'app',
    action: 'delete',
    category: 'application'
  },
  'app:access': {
    name: 'app:access',
    description: 'Accéder aux applications',
    resource: 'app',
    action: 'access',
    category: 'application'
  },
  
  // Permissions Services
  'service:read': {
    name: 'service:read',
    description: 'Lire les informations des services',
    resource: 'service',
    action: 'read',
    category: 'service'
  },
  'service:write': {
    name: 'service:write',
    description: 'Modifier les services',
    resource: 'service',
    action: 'write',
    category: 'service'
  },
  'service:create': {
    name: 'service:create',
    description: 'Créer de nouveaux services',
    resource: 'service',
    action: 'create',
    category: 'service'
  },
  'service:delete': {
    name: 'service:delete',
    description: 'Supprimer des services',
    resource: 'service',
    action: 'delete',
    category: 'service'
  },
  'service:access': {
    name: 'service:access',
    description: 'Accéder aux services',
    resource: 'service',
    action: 'access',
    category: 'service'
  },
  
  // Permissions Logs
  'logs:read': {
    name: 'logs:read',
    description: 'Lire les logs',
    resource: 'logs',
    action: 'read',
    category: 'service'
  },
  'logs:write': {
    name: 'logs:write',
    description: 'Écrire des logs',
    resource: 'logs',
    action: 'write',
    category: 'service'
  },
  'logs:search': {
    name: 'logs:search',
    description: 'Rechercher dans les logs',
    resource: 'logs',
    action: 'search',
    category: 'service'
  },
  'logs:export': {
    name: 'logs:export',
    description: 'Exporter les logs',
    resource: 'logs',
    action: 'export',
    category: 'service'
  },
  'logs:delete': {
    name: 'logs:delete',
    description: 'Supprimer des logs',
    resource: 'logs',
    action: 'delete',
    category: 'service'
  },
  
  // Permissions Facturation
  'billing:read': {
    name: 'billing:read',
    description: 'Lire les informations de facturation',
    resource: 'billing',
    action: 'read',
    category: 'billing'
  },
  'billing:write': {
    name: 'billing:write',
    description: 'Modifier les informations de facturation',
    resource: 'billing',
    action: 'write',
    category: 'billing'
  },
  'billing:manage': {
    name: 'billing:manage',
    description: 'Gérer la facturation',
    resource: 'billing',
    action: 'manage',
    category: 'billing'
  },
  
  // Permissions Système
  'system:read': {
    name: 'system:read',
    description: 'Lire les informations système',
    resource: 'system',
    action: 'read',
    category: 'system'
  },
  'system:monitor': {
    name: 'system:monitor',
    description: 'Surveiller le système',
    resource: 'system',
    action: 'monitor',
    category: 'system'
  },
  'system:admin': {
    name: 'system:admin',
    description: 'Administrer le système',
    resource: 'system',
    action: 'admin',
    category: 'system'
  }
};

// Services disponibles dans le système
export const AVAILABLE_SERVICES = [
  {
    id: 'logs',
    name: 'Log Management',
    description: 'Gestion et analyse des logs système',
    requiredPermissions: ['logs:read'],
    adminPermissions: ['logs:*']
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Tableau de bord principal et analytics',
    requiredPermissions: ['service:access'],
    adminPermissions: ['service:*']
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    description: 'Gestionnaire de passerelle API',
    requiredPermissions: ['service:access'],
    adminPermissions: ['service:*']
  },
  {
    id: 'user-management',
    name: 'User Management',
    description: 'Gestion des utilisateurs et permissions',
    requiredPermissions: ['user:read'],
    adminPermissions: ['user:*']
  },
  {
    id: 'billing',
    name: 'Billing',
    description: 'Facturation et abonnements',
    requiredPermissions: ['billing:read'],
    adminPermissions: ['billing:*']
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Analytics avancés et reporting',
    requiredPermissions: ['service:access'],
    adminPermissions: ['service:*']
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    description: 'Surveillance système et alertes',
    requiredPermissions: ['system:monitor'],
    adminPermissions: ['system:*']
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Paramètres sécurité et logs d\'audit',
    requiredPermissions: ['organization:read'],
    adminPermissions: ['organization:*']
  }
];

// Applications disponibles dans le système
export const AVAILABLE_APPLICATIONS = [
  {
    id: 'admin-console',
    name: 'Admin Console',
    description: 'Interface d\'administration principale',
    requiredPermissions: ['app:access'],
    adminPermissions: ['app:*']
  },
  {
    id: 'customer-portal',
    name: 'Customer Portal',
    description: 'Portail client',
    requiredPermissions: ['app:access'],
    adminPermissions: ['app:*']
  },
  {
    id: 'developer-api',
    name: 'Developer API',
    description: 'API documentation et testing',
    requiredPermissions: ['service:access'],
    adminPermissions: ['service:*']
  },
  {
    id: 'mobile-app',
    name: 'Mobile Application',
    description: 'Application mobile',
    requiredPermissions: ['app:access'],
    adminPermissions: ['app:*']
  },
  {
    id: 'partner-portal',
    name: 'Partner Portal',
    description: 'Portail partenaires',
    requiredPermissions: ['app:access'],
    adminPermissions: ['app:*']
  },
  {
    id: 'reporting',
    name: 'Reporting',
    description: 'Reporting avancé et BI',
    requiredPermissions: ['billing:read'],
    adminPermissions: ['billing:*']
  }
];

// Helper functions pour la gestion des permissions
export class PermissionHelper {
  // Vérifier si un rôle existe
  static isValidRole(role: string): boolean {
    return Object.keys(ROLES).includes(role);
  }

  // Obtenir la configuration d'un rôle
  static getRoleConfig(role: string): RoleConfig | undefined {
    return ROLES[role];
  }

  // Obtenir toutes les permissions d'un rôle
  static getRolePermissions(role: string): string[] {
    const roleConfig = ROLES[role];
    if (!roleConfig) return [];
    
    let permissions = [...roleConfig.permissions];
    
    // Ajouter les permissions des rôles hérités
    if (roleConfig.inherits) {
      for (const inheritedRole of roleConfig.inherits) {
        permissions.push(...this.getRolePermissions(inheritedRole));
      }
    }
    
    return [...new Set(permissions)]; // Dédoublonner
  }

  // Vérifier si une permission existe
  static isValidPermission(permission: string): boolean {
    return Object.keys(PERMISSIONS).includes(permission);
  }

  // Obtenir la configuration d'une permission
  static getPermissionConfig(permission: string): PermissionConfig | undefined {
    return PERMISSIONS[permission];
  }

  // Vérifier si une permission est accordée par un rôle
  static hasPermission(role: string, permission: string): boolean {
    const rolePermissions = this.getRolePermissions(role);
    
    // Vérification exacte
    if (rolePermissions.includes(permission)) {
      return true;
    }
    
    // Vérification par wildcard
    const [resource, action, scope] = permission.split(':');
    const wildcardPermission = `${resource}:*`;
    if (rolePermissions.includes(wildcardPermission)) {
      return true;
    }
    
    // Vérification par wildcard complet
    if (rolePermissions.includes('*')) {
      return true;
    }
    
    return false;
  }

  // Obtenir les services accessibles pour un rôle
  static getAccessibleServices(role: string): typeof AVAILABLE_SERVICES {
    const rolePermissions = this.getRolePermissions(role);
    
    return AVAILABLE_SERVICES.filter(service => {
      return service.requiredPermissions.some(perm => 
        rolePermissions.includes(perm) ||
        this.matchesWildcard(rolePermissions, perm)
      );
    });
  }

  // Obtenir les applications accessibles pour un rôle
  static getAccessibleApplications(role: string): typeof AVAILABLE_APPLICATIONS {
    const rolePermissions = this.getRolePermissions(role);
    
    return AVAILABLE_APPLICATIONS.filter(app => {
      return app.requiredPermissions.some(perm => 
        rolePermissions.includes(perm) ||
        this.matchesWildcard(rolePermissions, perm)
      );
    });
  }

  // Vérifier si une permission correspond à un wildcard
  private static matchesWildcard(permissions: string[], permission: string): boolean {
    const [resource, action] = permission.split(':');
    
    return permissions.some(perm => {
      if (perm === '*') return true;
      if (perm === `${resource}:*`) return true;
      if (perm === `${resource}:${action}`) return true;
      return false;
    });
  }

  // Valider une hiérarchie de rôles
  static validateRoleHierarchy(currentRole: string, targetRole: string): boolean {
    const hierarchy = ['viewer', 'member', 'admin', 'owner'];
    const currentIndex = hierarchy.indexOf(currentRole);
    const targetIndex = hierarchy.indexOf(targetRole);
    
    return currentIndex >= targetIndex;
  }
}