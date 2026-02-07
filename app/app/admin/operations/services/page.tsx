"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dashboard/ui/dialog";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Globe,
  Info,
  LayoutGrid,
  Layers,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  Server,
  Shield,
  WifiOff,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type ServiceStatus = "running" | "degraded" | "stopped" | "unreachable";
type ServiceCategory = "core" | "supporting" | "external";

interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  status: ServiceStatus;
  uptime: string;
  lastCheck: string;
  version?: string;
  environment: "container" | "external" | "local";
  healthEndpoint?: string;
  dependencies?: string[];
  dependentServices?: string[];
  startupTime?: string;
  load?: string;
  config?: {
    runtimeMode: string;
    keyFlags: string[];
  };
}

interface ServiceCategoryData {
  id: ServiceCategory;
  title: string;
  description: string;
  icon: React.ElementType;
}

// Mock data
const serviceCategories: ServiceCategoryData[] = [
  {
    id: "core",
    title: "Core Identity Services",
    description: "Primary services powering the Identity platform",
    icon: Shield,
  },
  {
    id: "supporting",
    title: "Supporting Services",
    description: "Infrastructure and data layer services",
    icon: Layers,
  },
  {
    id: "external",
    title: "External / Integrated Services",
    description: "Third-party integrations and external providers",
    icon: Globe,
  },
];

const servicesData: Service[] = [
  // Core Identity Services
  {
    id: "identity-api",
    name: "Identity API",
    description: "Primary REST API for identity operations",
    category: "core",
    status: "running",
    uptime: "99.99%",
    lastCheck: "2 minutes ago",
    version: "v2.4.1",
    environment: "container",
    healthEndpoint: "/health",
    dependencies: ["database", "cache"],
    dependentServices: ["authentication-engine", "authorization-engine"],
    startupTime: "3.2s",
    load: "23%",
    config: {
      runtimeMode: "production",
      keyFlags: ["REPLICAS: 3", "RATE_LIMIT: 10k/min"],
    },
  },
  {
    id: "authentication-engine",
    name: "Authentication Engine",
    description: "Handles user authentication and session validation",
    category: "core",
    status: "running",
    uptime: "99.97%",
    lastCheck: "2 minutes ago",
    version: "v2.4.0",
    environment: "container",
    healthEndpoint: "/health",
    dependencies: ["identity-api", "session-manager"],
    startupTime: "2.8s",
    load: "18%",
    config: {
      runtimeMode: "production",
      keyFlags: ["MFA_ENABLED", "SSO_ENABLED"],
    },
  },
  {
    id: "authorization-engine",
    name: "Authorization Engine",
    description: "Policy evaluation and access control decisions",
    category: "core",
    status: "running",
    uptime: "99.98%",
    lastCheck: "1 minute ago",
    version: "v2.4.1",
    environment: "container",
    dependencies: ["identity-api", "database"],
    startupTime: "2.5s",
    load: "15%",
    config: {
      runtimeMode: "production",
      keyFlags: ["POLICY_CACHE: 5min"],
    },
  },
  {
    id: "session-manager",
    name: "Session Manager",
    description: "Session lifecycle and token management",
    category: "core",
    status: "running",
    uptime: "99.95%",
    lastCheck: "3 minutes ago",
    version: "v2.3.8",
    environment: "container",
    dependencies: ["cache", "database"],
    startupTime: "1.9s",
    load: "31%",
    config: {
      runtimeMode: "production",
      keyFlags: ["SESSION_TTL: 24h", "TOKEN_ROTATION: enabled"],
    },
  },
  {
    id: "token-service",
    name: "Token Service",
    description: "JWT issuance, validation, and rotation",
    category: "core",
    status: "running",
    uptime: "99.99%",
    lastCheck: "1 minute ago",
    version: "v2.4.2",
    environment: "container",
    dependencies: ["cache"],
    startupTime: "1.5s",
    load: "12%",
    config: {
      runtimeMode: "production",
      keyFlags: ["ALGORITHM: RS256", "KEY_ROTATION: 30d"],
    },
  },
  // Supporting Services
  {
    id: "database",
    name: "Database",
    description: "Primary PostgreSQL instance",
    category: "supporting",
    status: "running",
    uptime: "99.99%",
    lastCheck: "Just now",
    version: "PostgreSQL 15.4",
    environment: "container",
    healthEndpoint: "/health",
    dependentServices: [
      "identity-api",
      "authorization-engine",
      "session-manager",
    ],
    startupTime: "12.4s",
    load: "42%",
    config: {
      runtimeMode: "production",
      keyFlags: ["REPLICAS: 2", "BACKUP: nightly"],
    },
  },
  {
    id: "cache",
    name: "Cache",
    description: "Redis cluster for session and policy caching",
    category: "supporting",
    status: "running",
    uptime: "99.96%",
    lastCheck: "1 minute ago",
    version: "Redis 7.2",
    environment: "container",
    dependencies: [],
    dependentServices: ["identity-api", "session-manager", "token-service"],
    startupTime: "0.8s",
    load: "28%",
    config: {
      runtimeMode: "production",
      keyFlags: ["NODES: 3", "PERSISTENCE: AOF"],
    },
  },
  {
    id: "message-queue",
    name: "Message Queue",
    description: "RabbitMQ for async processing",
    category: "supporting",
    status: "degraded",
    uptime: "98.45%",
    lastCheck: "5 minutes ago",
    version: "RabbitMQ 3.12",
    environment: "container",
    startupTime: "4.2s",
    load: "67%",
    config: {
      runtimeMode: "production",
      keyFlags: ["QUEUE_DEPTH: high", "CONSUMER_LAG: 2min"],
    },
  },
  {
    id: "search",
    name: "Search / Indexing",
    description: "Elasticsearch for user and audit search",
    category: "supporting",
    status: "running",
    uptime: "99.92%",
    lastCheck: "2 minutes ago",
    version: "Elasticsearch 8.11",
    environment: "container",
    startupTime: "8.7s",
    load: "35%",
    config: {
      runtimeMode: "production",
      keyFlags: ["INDEX_REFRESH: 5s", "SHARDS: 5"],
    },
  },
  {
    id: "audit-logs",
    name: "Audit / Logs",
    description: "Centralized logging and audit trail storage",
    category: "supporting",
    status: "running",
    uptime: "99.94%",
    lastCheck: "3 minutes ago",
    version: "v1.8.2",
    environment: "container",
    startupTime: "2.1s",
    load: "22%",
    config: {
      runtimeMode: "production",
      keyFlags: ["RETENTION: 90d", "COMPRESSION: enabled"],
    },
  },
  // External Services
  {
    id: "smtp",
    name: "SMTP / Email",
    description: "Email delivery via SendGrid",
    category: "external",
    status: "running",
    uptime: "99.89%",
    lastCheck: "4 minutes ago",
    version: "API v3",
    environment: "external",
    startupTime: "N/A",
    load: "8%",
    config: {
      runtimeMode: "external",
      keyFlags: ["PROVIDER: SendGrid", "DEDICATED_IP"],
    },
  },
  {
    id: "sms-gateway",
    name: "SMS Gateway",
    description: "SMS delivery via Twilio",
    category: "external",
    status: "running",
    uptime: "99.87%",
    lastCheck: "5 minutes ago",
    version: "API v2010",
    environment: "external",
    startupTime: "N/A",
    load: "5%",
    config: {
      runtimeMode: "external",
      keyFlags: ["PROVIDER: Twilio", "MFA_ENABLED"],
    },
  },
  {
    id: "push-notifications",
    name: "Push Notification Provider",
    description: "Firebase Cloud Messaging for push",
    category: "external",
    status: "running",
    uptime: "99.95%",
    lastCheck: "6 minutes ago",
    version: "FCM v1",
    environment: "external",
    startupTime: "N/A",
    load: "12%",
    config: {
      runtimeMode: "external",
      keyFlags: ["PROVIDER: Firebase", "BATCH_SEND: enabled"],
    },
  },
  {
    id: "external-idp",
    name: "External IdP Bridge",
    description: "SAML/OIDC integration with Azure AD",
    category: "external",
    status: "degraded",
    uptime: "97.23%",
    lastCheck: "10 minutes ago",
    version: "SAML 2.0",
    environment: "external",
    startupTime: "N/A",
    load: "N/A",
    config: {
      runtimeMode: "external",
      keyFlags: ["PROVIDER: Azure AD", "SLO_ENABLED"],
    },
  },
];

// Status configuration
const statusConfig: Record<
  ServiceStatus,
  { label: string; icon: React.ElementType; color: string; bgColor: string }
> = {
  running: {
    label: "Running",
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
  stopped: {
    label: "Stopped",
    icon: PauseCircle,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
  unreachable: {
    label: "Unreachable",
    icon: WifiOff,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
};

const environmentConfig: Record<string, { label: string; color: string }> = {
  container: { label: "Container", color: "text-blue-500" },
  external: { label: "External", color: "text-purple-500" },
  local: { label: "Local", color: "text-slate-500" },
};

// Components
function StatusBadge({ status }: { status: ServiceStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      className={cn(
        "h-6 px-2 text-xs font-medium border-0",
        config.bgColor,
        config.color,
      )}
    >
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}

function ServiceCard({
  service,
  onViewDetails,
}: {
  service: Service;
  onViewDetails: (service: Service) => void;
}) {
  const envConfig = environmentConfig[service.environment];

  return (
    <Card className="border-border bg-card hover:border-border/80 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground truncate">
                {service.name}
              </h3>
              <span className={cn("text-xs", envConfig.color)}>
                {envConfig.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {service.description}
            </p>
            <div className="flex items-center gap-3 text-xs">
              <StatusBadge status={service.status} />
              <span className="text-muted-foreground">
                {service.uptime} uptime
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Checked {service.lastCheck}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 ml-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => onViewDetails(service)}
                >
                  <Info className="h-3 w-3 mr-1" />
                  Details
                </Button>
              </DialogTrigger>
              <ServiceDetailDialog service={service} />
            </Dialog>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground"
            >
              <FileText className="h-3 w-3 mr-1" />
              Logs
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ServiceDetailDialog({ service }: { service: Service }) {
  const envConfig = environmentConfig[service.environment];
  const statusCfg = statusConfig[service.status];
  const StatusIcon = statusCfg.icon;

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Server className="h-5 w-5 text-muted-foreground" />
          {service.name}
        </DialogTitle>
        <DialogDescription>{service.description}</DialogDescription>
      </DialogHeader>

      <div className="space-y-6 mt-4">
        {/* Overview */}
        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            Overview
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground">Status</span>
              <div className="flex items-center gap-2">
                <StatusIcon className={cn("h-4 w-4", statusCfg.color)} />
                <span className={statusCfg.color}>{statusCfg.label}</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Uptime</span>
              <p className="text-foreground">{service.uptime}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Environment</span>
              <p className={envConfig.color}>{envConfig.label}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Version</span>
              <p className="text-foreground">{service.version || "N/A"}</p>
            </div>
            {service.startupTime && (
              <div className="space-y-1">
                <span className="text-muted-foreground">Startup Time</span>
                <p className="text-foreground">{service.startupTime}</p>
              </div>
            )}
            {service.load && (
              <div className="space-y-1">
                <span className="text-muted-foreground">Current Load</span>
                <p className="text-foreground">{service.load}</p>
              </div>
            )}
          </div>
        </section>

        {/* Connectivity */}
        {(service.dependencies?.length ||
          service.dependentServices?.length) && (
          <section className="space-y-3">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              Connectivity
            </h4>
            {service.dependencies && service.dependencies.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">
                  Dependencies
                </span>
                <div className="flex flex-wrap gap-2">
                  {service.dependencies.map((dep) => (
                    <Badge key={dep} variant="secondary" className="text-xs">
                      {dep}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {service.dependentServices &&
              service.dependentServices.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground">
                    Dependent Services
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {service.dependentServices.map((dep) => (
                      <Badge key={dep} variant="outline" className="text-xs">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </section>
        )}

        {/* Configuration */}
        {service.config && (
          <section className="space-y-3">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
              Configuration
              <Badge variant="secondary" className="text-[10px] ml-2">
                Read-only
              </Badge>
            </h4>
            <div className="space-y-3 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground">Runtime Mode</span>
                <p className="text-foreground font-mono text-xs">
                  {service.config.runtimeMode}
                </p>
              </div>
              {service.config.keyFlags.length > 0 && (
                <div className="space-y-2">
                  <span className="text-muted-foreground">Key Flags</span>
                  <div className="flex flex-wrap gap-2">
                    {service.config.keyFlags.map((flag) => (
                      <Badge
                        key={flag}
                        variant="secondary"
                        className="text-xs font-mono bg-muted"
                      >
                        {flag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Health Check */}
        {service.healthEndpoint && (
          <section className="space-y-3">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              Health Check
            </h4>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Endpoint:</span>
              <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                {service.healthEndpoint}
              </code>
            </div>
          </section>
        )}
      </div>
    </DialogContent>
  );
}

function CategorySection({
  category,
  services,
  onViewDetails,
}: {
  category: ServiceCategoryData;
  services: Service[];
  onViewDetails: (service: Service) => void;
}) {
  const Icon = category.icon;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 pb-2 border-b border-border">
        <div className="p-2 rounded-md bg-secondary">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-sm font-medium text-foreground">
            {category.title}
          </h2>
          <p className="text-xs text-muted-foreground">
            {category.description}
          </p>
        </div>
        <Badge variant="secondary" className="ml-auto text-xs">
          {services.length} services
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </section>
  );
}

export default function ServicesPage() {
  const [selectedService, setSelectedService] = React.useState<Service | null>(
    null,
  );

  // Calculate system health metrics
  const runningServices = servicesData.filter(
    (s) => s.status === "running",
  ).length;
  const degradedServices = servicesData.filter(
    (s) => s.status === "degraded",
  ).length;
  const stoppedServices = servicesData.filter(
    (s) => s.status === "stopped" || s.status === "unreachable",
  ).length;

  let systemHealth: { status: string; color: string; icon: React.ElementType } =
    {
      status: "Healthy",
      color: "text-emerald-500",
      icon: CheckCircle2,
    };

  if (stoppedServices > 0) {
    systemHealth = {
      status: "Critical",
      color: "text-destructive",
      icon: XCircle,
    };
  } else if (degradedServices > 0) {
    systemHealth = {
      status: "Degraded",
      color: "text-amber-500",
      icon: AlertCircle,
    };
  }

  const HealthIcon = systemHealth.icon;

  // Group services by category
  const groupedServices = serviceCategories.map((category) => ({
    category,
    services: servicesData.filter((s) => s.category === category.id),
  }));

  return (
    <div className="space-y-8 text-foreground">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-card-foreground">
          Services
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Operational status of Identity services and dependencies.
        </p>
      </div>

      {/* System Health Overview */}
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {/* Overall Health */}
            <div className="p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Activity className="h-3 w-3" />
                System Health
              </div>
              <div className="flex items-center gap-2">
                <HealthIcon className={cn("h-4 w-4", systemHealth.color)} />
                <p className={cn("text-sm font-medium", systemHealth.color)}>
                  {systemHealth.status}
                </p>
              </div>
            </div>

            {/* Running Services */}
            <div className="p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <PlayCircle className="h-3 w-3" />
                Running
              </div>
              <p className="text-sm font-medium text-foreground">
                {runningServices} services
              </p>
            </div>

            {/* Degraded Services */}
            <div className="p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <AlertCircle className="h-3 w-3" />
                Degraded
              </div>
              <p
                className={cn(
                  "text-sm font-medium",
                  degradedServices > 0 ? "text-amber-500" : "text-foreground",
                )}
              >
                {degradedServices} services
              </p>
            </div>

            {/* Total Services */}
            <div className="p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Server className="h-3 w-3" />
                Total Services
              </div>
              <p className="text-sm font-medium text-foreground">
                {servicesData.length} services
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Categories */}
      {groupedServices.map(({ category, services }) => (
        <CategorySection
          key={category.id}
          category={category}
          services={services}
          onViewDetails={setSelectedService}
        />
      ))}

      {/* Health & Monitoring Info */}
      <Card className="border-border bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Health & Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Services are checked every 60 seconds via automated health probes.
            Health status reflects the most recent check result and may not
            reflect instantaneous conditions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <p className="font-medium text-foreground">Status Definitions:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  <span className="text-emerald-500">Running</span>: Service is
                  operational and responding normally
                </li>
                <li>
                  <span className="text-amber-500">Degraded</span>: Service is
                  operational but experiencing issues
                </li>
                <li>
                  <span className="text-slate-500">Stopped</span>: Service is
                  intentionally stopped
                </li>
                <li>
                  <span className="text-destructive">Unreachable</span>: Service
                  cannot be contacted
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Important Notes:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Degraded services may auto-recover without intervention</li>
                <li>Not all warnings require immediate action</li>
                <li>External services may have their own status pages</li>
                <li>Check frequency: 60s | Timeout: 10s | Retries: 3</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Deployment Awareness */}
      <Card className="border-border bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            Security & Deployment Awareness
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            This page provides operational visibility into your Identity
            infrastructure. Some important considerations:
          </p>
          <ul className="space-y-2 text-xs list-disc list-inside">
            <li>
              <strong className="text-foreground">External Services:</strong>{" "}
              Some services (email, SMS, external IdPs) are managed by
              third-party providers. Their status reflects best-effort checks
              and may differ from their official status pages.
            </li>
            <li>
              <strong className="text-foreground">Control Limitations:</strong>{" "}
              Not all services are controllable from this admin panel. External
              integrations require management through their respective provider
              consoles.
            </li>
            <li>
              <strong className="text-foreground">
                Self-Hosted Deployments:
              </strong>{" "}
              If you&apos;re running a self-hosted deployment, you may have
              additional control over service lifecycle and configuration
              through your infrastructure tooling.
            </li>
            <li>
              <strong className="text-foreground">Read-Only View:</strong> This
              page is designed for observation. Configuration changes and
              destructive actions are intentionally limited to prevent
              accidental disruption.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
