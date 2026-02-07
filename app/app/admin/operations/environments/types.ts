// Environment types for the admin panel

export type EnvironmentType = "dev" | "staging" | "production" | "custom";
export type EnvironmentStatus = "healthy" | "degraded" | "unhealthy" | "unknown";

export interface Environment {
  id: string;
  name: string;
  type: EnvironmentType;
  status: EnvironmentStatus;
  region: string;
  owner: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  resources: {
    cpu: string;
    memory: string;
    storage: string;
  };
  limits: {
    users: number;
    devices: number;
    apiCalls: number;
  };
  activeModules: string[];
  configuration: {
    runtimeMode: string;
    keyFlags: string[];
  };
  connectivity: {
    databases: string[];
    services: string[];
    externalIdPs: string[];
  };
  lastError?: string;
  lastWarning?: string;
}

// Mock data for environments
export const environmentsData: Environment[] = [
  {
    id: "1",
    name: "Production",
    type: "production",
    status: "healthy",
    region: "us-east-1",
    owner: "Platform Team",
    version: "v2.4.2",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:22:00Z",
    resources: {
      cpu: "8 vCPU",
      memory: "32 GB",
      storage: "500 GB",
    },
    limits: {
      users: 10000,
      devices: 5000,
      apiCalls: 1000000,
    },
    activeModules: ["identity-api", "authentication-engine", "authorization-engine"],
    configuration: {
      runtimeMode: "production",
      keyFlags: ["REPLICAS: 3", "RATE_LIMIT: 10k/min", "BACKUP: nightly"],
    },
    connectivity: {
      databases: ["primary-db", "audit-db"],
      services: ["cache", "message-queue", "search"],
      externalIdPs: ["Azure AD", "Google Workspace"],
    },
    lastError: null,
    lastWarning: null,
  },
  {
    id: "2",
    name: "Staging",
    type: "staging",
    status: "degraded",
    region: "us-west-2",
    owner: "QA Team",
    version: "v2.4.1",
    createdAt: "2024-02-01T14:15:00Z",
    updatedAt: "2024-02-05T09:30:00Z",
    resources: {
      cpu: "4 vCPU",
      memory: "16 GB",
      storage: "200 GB",
    },
    limits: {
      users: 1000,
      devices: 500,
      apiCalls: 100000,
    },
    activeModules: ["identity-api", "authentication-engine"],
    configuration: {
      runtimeMode: "staging",
      keyFlags: ["REPLICAS: 1", "RATE_LIMIT: 1k/min"],
    },
    connectivity: {
      databases: ["staging-db"],
      services: ["cache", "message-queue"],
      externalIdPs: ["Azure AD (test)", "Okta (test)"],
    },
    lastError: "High message queue depth",
    lastWarning: "Cache miss rate increased",
  },
  {
    id: "3",
    name: "Development",
    type: "dev",
    status: "healthy",
    region: "us-east-1",
    owner: "Development Team",
    version: "v2.4.0",
    createdAt: "2024-01-10T08:45:00Z",
    updatedAt: "2024-01-12T16:30:00Z",
    resources: {
      cpu: "2 vCPU",
      memory: "8 GB",
      storage: "100 GB",
    },
    limits: {
      users: 100,
      devices: 50,
      apiCalls: 10000,
    },
    activeModules: ["identity-api", "authentication-engine"],
    configuration: {
      runtimeMode: "development",
      keyFlags: ["DEBUG: true", "LOG_LEVEL: debug"],
    },
    connectivity: {
      databases: ["dev-db"],
      services: ["cache"],
      externalIdPs: ["Local Auth"],
    },
    lastError: null,
    lastWarning: null,
  },
  {
    id: "4",
    name: "Custom Environment",
    type: "custom",
    status: "unknown",
    region: "eu-central-1",
    owner: "Customer Success",
    version: "v2.3.9",
    createdAt: "2024-03-15T11:20:00Z",
    updatedAt: "2024-03-18T13:45:00Z",
    resources: {
      cpu: "4 vCPU",
      memory: "16 GB",
      storage: "250 GB",
    },
    limits: {
      users: 500,
      devices: 250,
      apiCalls: 50000,
    },
    activeModules: ["identity-api"],
    configuration: {
      runtimeMode: "custom",
      keyFlags: ["CUSTOM_FLAGS: enabled"],
    },
    connectivity: {
      databases: ["custom-db"],
      services: ["cache"],
      externalIdPs: ["Custom IdP"],
    },
    lastError: "Configuration incomplete",
    lastWarning: "Missing backup configuration",
  },
];

// Status configuration for environments
export const environmentStatusConfig: Record<
  EnvironmentStatus,
  { label: string; icon: React.ElementType; color: string; bgColor: string }
> = {
  healthy: {
    label: "Healthy",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  degraded: {
    label: "Degraded",
    icon: AlertCircle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  unhealthy: {
    label: "Unhealthy",
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  unknown: {
    label: "Unknown",
    icon: HelpCircle,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
};

// Environment type configuration
export const environmentTypeConfig: Record<
  EnvironmentType,
  { label: string; color: string; description: string }
> = {
  production: {
    label: "Production",
    color: "text-emerald-500",
    description: "Live environment for production workloads",
  },
  staging: {
    label: "Staging",
    color: "text-amber-500",
    description: "Pre-production environment for testing",
  },
  dev: {
    label: "Development",
    color: "text-blue-500",
    description: "Development environment for feature development",
  },
  custom: {
    label: "Custom",
    color: "text-purple-500",
    description: "Custom-configured environment",
  },
};
