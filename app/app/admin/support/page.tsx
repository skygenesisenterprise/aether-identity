"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/dashboard/ui/tabs";
import { Separator } from "@/components/dashboard/ui/separator";
import { Progress } from "@/components/dashboard/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dashboard/ui/dialog";
import { Input } from "@/components/dashboard/ui/input";
import { Label } from "@/components/dashboard/ui/label";
import { Textarea } from "@/components/dashboard/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import {
  Cloud,
  Server,
  BookOpen,
  LifeBuoy,
  Activity,
  FileText,
  ExternalLink,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Wifi,
  WifiOff,
  Copy,
  Download,
  RefreshCw,
  Shield,
  Cpu,
  Database,
  HardDrive,
  Clock,
  ChevronRight,
  Github,
  Globe,
  Zap,
  Wrench,
  Terminal,
  Bug,
  FileCode,
  CheckCircle,
  AlertOctagon,
} from "lucide-react";

// ============================================================================
// TYPES & CONFIGURATION
// ============================================================================

type DeploymentMode = "cloud" | "self-hosted";
type ServiceStatus = "healthy" | "degraded" | "critical" | "unknown";
type ConnectivityStatus = "online" | "offline" | "limited";

interface SystemService {
  id: string;
  name: string;
  status: ServiceStatus;
  description: string;
  lastCheck: string;
}

interface EnvironmentInfo {
  mode: DeploymentMode;
  version: string;
  buildNumber: string;
  installDate: string;
  connectivity: ConnectivityStatus;
  region?: string;
  instanceId?: string;
}

// ============================================================================
// MOCK DATA - Environment Detection (In production, this would come from API)
// ============================================================================

const environmentData: EnvironmentInfo = {
  mode: "cloud", // Change to "self-hosted" to test self-hosted mode
  version: "2.4.2",
  buildNumber: "2025.02.10-1423",
  installDate: "2024-06-15",
  connectivity: "online",
  region: "us-east-1",
  instanceId: "aether-prod-7823",
};

const servicesData: SystemService[] = [
  {
    id: "auth",
    name: "Authentication Service",
    status: "healthy",
    description: "User login and session management",
    lastCheck: "2s ago",
  },
  {
    id: "identity",
    name: "Identity Engine",
    status: "healthy",
    description: "Core identity management",
    lastCheck: "5s ago",
  },
  {
    id: "database",
    name: "Database",
    status: "healthy",
    description: "Primary data store",
    lastCheck: "3s ago",
  },
  {
    id: "cache",
    name: "Cache Layer",
    status: "degraded",
    description: "Redis cache cluster",
    lastCheck: "10s ago",
  },
  {
    id: "messaging",
    name: "Message Queue",
    status: "healthy",
    description: "Event processing",
    lastCheck: "4s ago",
  },
];

const documentationLinks = {
  cloud: [
    {
      title: "Getting Started Guide",
      description: "Quick start for cloud deployments",
      href: "https://docs.aetheridentity.com/cloud/getting-started",
      icon: BookOpen,
    },
    {
      title: "Cloud Features",
      description: "Explore SaaS capabilities",
      href: "https://docs.aetheridentity.com/cloud/features",
      icon: Cloud,
    },
    {
      title: "API Reference",
      description: "Complete API documentation",
      href: "https://docs.aetheridentity.com/api",
      icon: FileCode,
    },
  ],
  selfHosted: [
    {
      title: "Installation Guide",
      description: "Deploy on your infrastructure",
      href: "https://docs.aetheridentity.com/self-hosted/install",
      icon: Server,
    },
    {
      title: "Configuration",
      description: "Advanced configuration options",
      href: "https://docs.aetheridentity.com/self-hosted/config",
      icon: Wrench,
    },
    {
      title: "Maintenance",
      description: "Updates, backups, and monitoring",
      href: "https://docs.aetheridentity.com/self-hosted/maintenance",
      icon: RefreshCw,
    },
  ],
  common: [
    {
      title: "Security Best Practices",
      description: "Hardening and compliance",
      href: "https://docs.aetheridentity.com/security",
      icon: Shield,
    },
    {
      title: "Troubleshooting",
      description: "Common issues and solutions",
      href: "https://docs.aetheridentity.com/troubleshooting",
      icon: Bug,
    },
    {
      title: "Release Notes",
      description: "Version history and changes",
      href: "https://docs.aetheridentity.com/releases",
      icon: FileText,
    },
  ],
};

const incidentsData = [
  {
    id: "inc-001",
    severity: "resolved" as const,
    title: "Cache latency spike",
    description: "Temporary increased response times",
    startTime: "2025-02-09 14:30 UTC",
    endTime: "2025-02-09 15:15 UTC",
    affected: ["Cache Layer"],
  },
  {
    id: "inc-002",
    severity: "ongoing" as const,
    title: "Message queue backlog",
    description: "Processing delays for async events",
    startTime: "2025-02-10 08:00 UTC",
    endTime: null,
    affected: ["Message Queue"],
  },
];

const maintenanceData = [
  {
    id: "mnt-001",
    title: "Scheduled Database Maintenance",
    scheduledFor: "2025-02-15 02:00 UTC",
    duration: "30 minutes",
    impact: "Read-only mode during migration",
  },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function StatusIcon({ status }: { status: ServiceStatus }) {
  switch (status) {
    case "healthy":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case "degraded":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "critical":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertOctagon className="h-4 w-4 text-muted-foreground" />;
  }
}

function ConnectivityIcon({ status }: { status: ConnectivityStatus }) {
  switch (status) {
    case "online":
      return <Wifi className="h-4 w-4 text-emerald-500" />;
    case "limited":
      return <Wifi className="h-4 w-4 text-amber-500" />;
    case "offline":
      return <WifiOff className="h-4 w-4 text-red-500" />;
  }
}

function IncidentBadge({ severity }: { severity: "resolved" | "ongoing" }) {
  if (severity === "resolved") {
    return (
      <Badge variant="outline" className="text-emerald-500 border-emerald-500">
        Resolved
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-amber-500 border-amber-500">
      Ongoing
    </Badge>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

// ============================================================================
// CREATE TICKET DIALOG COMPONENT
// ============================================================================

function CreateTicketDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [priority, setPriority] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Ticket created:", {
      subject,
      category,
      priority,
      description,
      timestamp: new Date().toISOString(),
    });

    setIsSubmitting(false);
    setOpen(false);

    // Reset form
    setSubject("");
    setCategory("");
    setPriority("");
    setDescription("");

    // Show success message (in production, use a toast)
    alert(
      "Support ticket created successfully! We'll get back to you within 4 hours.",
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <DialogDescription>
            Describe your issue and we&apos;ll get back to you within 4 hours.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="security">Security Concern</SelectItem>
                    <SelectItem value="account">Account Management</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority} required>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General question</SelectItem>
                    <SelectItem value="medium">Medium - Minor issue</SelectItem>
                    <SelectItem value="high">
                      High - Service affected
                    </SelectItem>
                    <SelectItem value="critical">
                      Critical - Service down
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Please provide detailed information about your issue..."
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function SupportPage() {
  const [env] = React.useState<EnvironmentInfo>(environmentData);
  const isCloud = env.mode === "cloud";

  const handleCopyDiagnostics = () => {
    const diagnostics = {
      version: env.version,
      build: env.buildNumber,
      mode: env.mode,
      services: servicesData.map((s) => ({ name: s.name, status: s.status })),
      timestamp: new Date().toISOString(),
    };
    navigator.clipboard.writeText(JSON.stringify(diagnostics, null, 2));
  };

  const handleExportLogs = () => {
    console.log("Exporting system logs...");
  };

  return (
    <div className="space-y-6 text-foreground">
      {/* =========================================================================
          HEADER SECTION
          ========================================================================= */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-card-foreground">
            Support
          </h1>
          <Badge
            variant={isCloud ? "default" : "secondary"}
            className="text-xs"
          >
            {isCloud ? (
              <>
                <Cloud className="h-3 w-3 mr-1" />
                Cloud
              </>
            ) : (
              <>
                <Server className="h-3 w-3 mr-1" />
                Self-Hosted
              </>
            )}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {isCloud
            ? "Get help with your cloud deployment, access documentation, and monitor system status"
            : "Resources and tools for managing your self-hosted Aether Identity installation"}
        </p>
      </div>

      {/* =========================================================================
          SECTION 1: ENVIRONMENT STATUS
          ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Environment Status
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Deployment Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {isCloud ? (
                  <Cloud className="h-4 w-4" />
                ) : (
                  <Server className="h-4 w-4" />
                )}
                Deployment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Mode</span>
                <Badge variant="outline">
                  {isCloud ? "Cloud SaaS" : "Self-Hosted"}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Version</span>
                <span className="text-sm font-medium">{env.version}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Build</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {env.buildNumber}
                </code>
              </div>
              {isCloud && env.region && (
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Region</span>
                  <span className="text-sm">{env.region}</span>
                </div>
              )}
              {isCloud && env.instanceId && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">
                    Instance
                  </span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {env.instanceId}
                  </code>
                </div>
              )}
              {!isCloud && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">
                    Installed
                  </span>
                  <span className="text-sm">{env.installDate}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Connectivity Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ConnectivityIcon status={env.connectivity} />
                Connectivity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      env.connectivity === "online"
                        ? "bg-emerald-500/20"
                        : env.connectivity === "limited"
                          ? "bg-amber-500/20"
                          : "bg-red-500/20"
                    }`}
                  >
                    <ConnectivityIcon status={env.connectivity} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {env.connectivity === "online"
                        ? "Fully Connected"
                        : env.connectivity === "limited"
                          ? "Limited Connectivity"
                          : "Offline"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {env.connectivity === "online"
                        ? "All services operational"
                        : env.connectivity === "limited"
                          ? "Some features may be unavailable"
                          : "Working in offline mode"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    Cloud API Status
                  </span>
                  <span
                    className={
                      env.connectivity === "online"
                        ? "text-emerald-500"
                        : "text-red-500"
                    }
                  >
                    {env.connectivity === "online" ? "Available" : "Offline"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    Documentation Access
                  </span>
                  <span className="text-emerald-500">Available</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Update Check</span>
                  <span
                    className={
                      env.connectivity === "online"
                        ? "text-emerald-500"
                        : "text-amber-500"
                    }
                  >
                    {env.connectivity === "online"
                      ? "Up to date"
                      : "Last check: 2h ago"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Health Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Service Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {servicesData.slice(0, 4).map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <StatusIcon status={service.status} />
                    <span className="text-sm">{service.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {service.lastCheck}
                  </span>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full mt-2">
                View All Services
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: MAIN CONTENT TABS
          ========================================================================= */}
      <Tabs defaultValue="documentation" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
          <TabsTrigger value="status">Status & Incidents</TabsTrigger>
        </TabsList>

        {/* =======================================================================
            DOCUMENTATION TAB
            ======================================================================= */}
        <TabsContent value="documentation" className="space-y-6">
          {/* Mode-specific Documentation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {isCloud ? "Cloud Documentation" : "Self-Hosted Documentation"}
              </CardTitle>
              <CardDescription>
                {isCloud
                  ? "Resources specific to your cloud deployment"
                  : "Guides for managing your local installation"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(isCloud
                  ? documentationLinks.cloud
                  : documentationLinks.selfHosted
                ).map((link) => (
                  <a
                    key={link.title}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <link.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                          {link.title}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {link.description}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Documentation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">General Resources</CardTitle>
              <CardDescription>
                Documentation applicable to all deployment modes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {documentationLinks.common.map((link) => (
                  <a
                    key={link.title}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <link.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                          {link.title}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {link.description}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  Open Source
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Aether Identity is open source. Report issues, contribute, or
                  review the code on GitHub.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://github.com/skygenesisenterprise/aether-identity"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      GitHub Repository
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://github.com/skygenesisenterprise/aether-identity/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Bug className="h-4 w-4 mr-2" />
                      Report Issue
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Join our community forums and Discord server for discussions
                  and peer support.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://community.aetheridentity.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Community Forum
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* =======================================================================
            SUPPORT TAB
            ======================================================================= */}
        <TabsContent value="support" className="space-y-6">
          {isCloud ? (
            /* Cloud Support Options */
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <LifeBuoy className="h-4 w-4" />
                    Contact Support
                  </CardTitle>
                  <CardDescription>
                    Get help from our dedicated support team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Open a Ticket</h3>
                          <p className="text-xs text-muted-foreground">
                            Response time: &lt; 4 hours
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Create a support ticket for technical issues, feature
                        requests, or general inquiries.
                      </p>
                      <CreateTicketDialog>
                        <Button className="w-full">Create Ticket</Button>
                      </CreateTicketDialog>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">Email Support</h3>
                          <p className="text-xs text-muted-foreground">
                            support@skygenesisenterprise.com
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Send us an email for non-urgent requests or detailed
                        technical questions.
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <a href="mailto:support@skygenesisenterprise.com">
                          Send Email
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Support SLA</CardTitle>
                  <CardDescription>
                    Your current support level and response times
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-semibold text-foreground">
                        24/7
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Support Availability
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-semibold text-foreground">
                        &lt; 4h
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Response Time
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-semibold text-foreground">
                        99.9%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Uptime SLA
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Self-Hosted Support Options */
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Self-Hosted Support
                  </CardTitle>
                  <CardDescription>
                    Resources for managing your own installation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-amber-400">
                          Community Support
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Self-hosted deployments rely on community support and
                          documentation. For enterprise support with SLA
                          guarantees, consider upgrading to a managed cloud
                          plan.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Github className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">GitHub Issues</h3>
                          <p className="text-xs text-muted-foreground">
                            Community-driven support
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Report bugs, request features, or ask questions on our
                        GitHub repository.
                      </p>
                      <Button className="w-full" asChild>
                        <a
                          href="https://github.com/skygenesisenterprise/aether-identity/issues"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open GitHub Issue
                        </a>
                      </Button>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">Community Forum</h3>
                          <p className="text-xs text-muted-foreground">
                            Peer-to-peer help
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Connect with other self-hosted users and share
                        solutions.
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <a
                          href="https://community.aetheridentity.com"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Forum
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Upgrade to Cloud</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Get access to managed infrastructure, automatic updates, and
                    24/7 professional support by migrating to our cloud
                    offering.
                  </p>
                  <Button variant="outline" asChild>
                    <a
                      href="https://skygenesisenterprise.com/contact"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Contact Sales
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* =======================================================================
            DIAGNOSTICS TAB
            ======================================================================= */}
        <TabsContent value="diagnostics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                System Diagnostics
              </CardTitle>
              <CardDescription>
                Technical information and health checks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Status Table */}
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-medium">Service</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium hidden md:table-cell">
                        Description
                      </th>
                      <th className="text-right p-3 font-medium">Last Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {servicesData.map((service) => (
                      <tr key={service.id} className="hover:bg-muted/50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <StatusIcon status={service.status} />
                            <span className="font-medium">{service.name}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            className={
                              service.status === "healthy"
                                ? "text-emerald-500 border-emerald-500"
                                : service.status === "degraded"
                                  ? "text-amber-500 border-amber-500"
                                  : service.status === "critical"
                                    ? "text-red-500 border-red-500"
                                    : ""
                            }
                          >
                            {service.status.charAt(0).toUpperCase() +
                              service.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-3 text-muted-foreground hidden md:table-cell">
                          {service.description}
                        </td>
                        <td className="p-3 text-right text-muted-foreground">
                          {service.lastCheck}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Resource Usage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">CPU Usage</span>
                  </div>
                  <Progress value={42} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>42% used</span>
                    <span>8 cores available</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Database</span>
                  </div>
                  <Progress value={67} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>67% connections used</span>
                    <span>100 max</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Storage</span>
                  </div>
                  <Progress value={34} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>340 GB used</span>
                    <span>1 TB total</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Memory</span>
                  </div>
                  <Progress value={58} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>11.6 GB used</span>
                    <span>20 GB total</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleCopyDiagnostics}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Diagnostics
                </Button>
                <Button variant="outline" onClick={handleExportLogs}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Logs
                </Button>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Status
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Node.js Version</p>
                  <p className="font-medium">v20.11.0</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Database</p>
                  <p className="font-medium">PostgreSQL 15.4</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cache</p>
                  <p className="font-medium">Redis 7.2</p>
                </div>
                <div>
                  <p className="text-muted-foreground">OS</p>
                  <p className="font-medium">Ubuntu 22.04 LTS</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Architecture</p>
                  <p className="font-medium">x86_64</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Kernel</p>
                  <p className="font-medium">5.15.0</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Timezone</p>
                  <p className="font-medium">UTC</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Uptime</p>
                  <p className="font-medium">45d 12h 34m</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =======================================================================
            STATUS & INCIDENTS TAB
            ======================================================================= */}
        <TabsContent value="status" className="space-y-6">
          {isCloud ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Service Status
                  </CardTitle>
                  <CardDescription>
                    Current operational status of Aether Identity Cloud
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <div>
                        <h3 className="font-medium text-emerald-400">
                          All Systems Operational
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Last updated: 2 minutes ago
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {servicesData.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <StatusIcon status={service.status} />
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <span
                          className={`text-sm ${
                            service.status === "healthy"
                              ? "text-emerald-500"
                              : service.status === "degraded"
                                ? "text-amber-500"
                                : "text-red-500"
                          }`}
                        >
                          {service.status === "healthy"
                            ? "Operational"
                            : service.status === "degraded"
                              ? "Degraded Performance"
                              : "Major Outage"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-center">
                    <a
                      href="https://status.skygenesisenterprise.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:underline inline-flex items-center gap-1"
                    >
                      View full status page
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Incidents */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Incidents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {incidentsData.map((incident) => (
                      <div
                        key={incident.id}
                        className="p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{incident.title}</h3>
                            <IncidentBadge severity={incident.severity} />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {incident.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Started: {incident.startTime}
                          </span>
                          {incident.endTime && (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Resolved: {incident.endTime}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {incident.affected.map((service) => (
                            <Badge
                              key={service}
                              variant="outline"
                              className="text-xs"
                            >
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Maintenance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Scheduled Maintenance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {maintenanceData.map((maintenance) => (
                      <div
                        key={maintenance.id}
                        className="p-4 rounded-lg border border-border bg-muted/30"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{maintenance.title}</h3>
                          <Badge variant="outline">Scheduled</Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="text-muted-foreground">
                            <span className="font-medium">When:</span>{" "}
                            {maintenance.scheduledFor}
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium">Duration:</span>{" "}
                            {maintenance.duration}
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium">Impact:</span>{" "}
                            {maintenance.impact}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Self-Hosted Status */
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Local Instance Status
                  </CardTitle>
                  <CardDescription>
                    Status of your self-hosted deployment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <div>
                        <h3 className="font-medium text-emerald-400">
                          Instance Running Normally
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          All local services are operational
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {servicesData.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <StatusIcon status={service.status} />
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <span
                          className={`text-sm ${
                            service.status === "healthy"
                              ? "text-emerald-500"
                              : service.status === "degraded"
                                ? "text-amber-500"
                                : "text-red-500"
                          }`}
                        >
                          {service.status === "healthy"
                            ? "Running"
                            : service.status === "degraded"
                              ? "Performance Issues"
                              : "Stopped"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cloud Services</CardTitle>
                  <CardDescription>
                    External services your instance connects to
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Update Repository</span>
                        <Badge
                          variant="outline"
                          className="text-emerald-500 border-emerald-500"
                        >
                          Available
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Telemetry</span>
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          Disabled
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">License Validation</span>
                        <Badge
                          variant="outline"
                          className="text-emerald-500 border-emerald-500"
                        >
                          Active
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Documentation CDN</span>
                        <Badge
                          variant="outline"
                          className="text-emerald-500 border-emerald-500"
                        >
                          Connected
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-start gap-3">
                      <Cloud className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-400">
                          Cloud Status
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Check the status of Aether Identity Cloud services
                          that your instance may depend on.
                        </p>
                        <a
                          href="https://status.skygenesisenterprise.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-accent hover:underline inline-flex items-center gap-1 mt-2"
                        >
                          View Cloud Status
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
