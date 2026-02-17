"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
  Monitor,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  PowerOff,
  Filter,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Download,
  Globe,
  Smartphone,
  Laptop,
  Tablet,
  MapPin,
  History,
  Activity,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
  XCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  DialogFooter,
} from "@/components/dashboard/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dashboard/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/dashboard/ui/table";
import { Input } from "@/components/dashboard/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/dashboard/ui/tabs";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface UserSession {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  groups: string[];
  device: string;
  browser: string;
  deviceType: "desktop" | "mobile" | "tablet";
  ipAddress: string;
  location?: string;
  country?: string;
  city?: string;
  loginTime: string;
  lastActivity: string;
  status: "active" | "idle" | "terminated";
  mfaEnabled: boolean;
  mfaVerified: boolean;
  riskScore?: number;
  isSuspicious?: boolean;
}

interface SessionStats {
  totalActive: number;
  idleSessions: number;
  highRiskSessions: number;
  mfaProtected: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockSessions: UserSession[] = [
  {
    id: "sess-001",
    userId: "usr-001",
    displayName: "John Smith",
    email: "john.smith@acme.com",
    groups: ["Engineering", "Backend Team"],
    device: "MacBook Pro",
    browser: "Chrome 120",
    deviceType: "desktop",
    ipAddress: "192.168.1.105",
    location: "San Francisco, US",
    country: "US",
    city: "San Francisco",
    loginTime: "2024-01-15T08:30:00Z",
    lastActivity: "2024-01-15T14:25:00Z",
    status: "active",
    mfaEnabled: true,
    mfaVerified: true,
    riskScore: 15,
    isSuspicious: false,
  },
  {
    id: "sess-002",
    userId: "usr-002",
    displayName: "Sarah Jones",
    email: "sarah.jones@acme.com",
    groups: ["Security", "Security Operations"],
    device: "iPhone 15 Pro",
    browser: "Safari Mobile",
    deviceType: "mobile",
    ipAddress: "203.45.67.89",
    location: "New York, US",
    country: "US",
    city: "New York",
    loginTime: "2024-01-15T12:15:00Z",
    lastActivity: "2024-01-15T14:20:00Z",
    status: "active",
    mfaEnabled: true,
    mfaVerified: true,
    riskScore: 10,
    isSuspicious: false,
  },
  {
    id: "sess-003",
    userId: "usr-003",
    displayName: "Michael Chen",
    email: "michael.chen@acme.com",
    groups: ["Engineering"],
    device: "Windows PC",
    browser: "Firefox 121",
    deviceType: "desktop",
    ipAddress: "185.220.101.42",
    location: "Unknown Location",
    country: "??",
    city: "Unknown",
    loginTime: "2024-01-15T09:00:00Z",
    lastActivity: "2024-01-15T10:30:00Z",
    status: "idle",
    mfaEnabled: false,
    mfaVerified: false,
    riskScore: 65,
    isSuspicious: true,
  },
  {
    id: "sess-004",
    userId: "usr-004",
    displayName: "Emily Davis",
    email: "emily.davis@acme.com",
    groups: ["Finance"],
    device: "iPad Pro",
    browser: "Chrome Mobile",
    deviceType: "tablet",
    ipAddress: "45.23.156.78",
    location: "London, UK",
    country: "UK",
    city: "London",
    loginTime: "2024-01-15T06:45:00Z",
    lastActivity: "2024-01-15T14:15:00Z",
    status: "active",
    mfaEnabled: true,
    mfaVerified: true,
    riskScore: 20,
    isSuspicious: false,
  },
  {
    id: "sess-005",
    userId: "usr-005",
    displayName: "David Wilson",
    email: "david.wilson@acme.com",
    groups: ["Product"],
    device: "MacBook Air",
    browser: "Safari 17",
    deviceType: "desktop",
    ipAddress: "98.76.54.32",
    location: "Austin, US",
    country: "US",
    city: "Austin",
    loginTime: "2024-01-15T13:00:00Z",
    lastActivity: "2024-01-15T13:45:00Z",
    status: "idle",
    mfaEnabled: true,
    mfaVerified: false,
    riskScore: 35,
    isSuspicious: false,
  },
  {
    id: "sess-006",
    userId: "usr-006",
    displayName: "Lisa Brown",
    email: "lisa.brown@acme.com",
    groups: ["Platform Engineering"],
    device: "Linux Workstation",
    browser: "Chrome 120",
    deviceType: "desktop",
    ipAddress: "203.0.113.50",
    location: "Seattle, US",
    country: "US",
    city: "Seattle",
    loginTime: "2024-01-15T07:00:00Z",
    lastActivity: "2024-01-15T14:30:00Z",
    status: "active",
    mfaEnabled: true,
    mfaVerified: true,
    riskScore: 5,
    isSuspicious: false,
  },
  {
    id: "sess-007",
    userId: "usr-007",
    displayName: "Robert Taylor",
    email: "robert.taylor@acme.com",
    groups: ["Frontend Team"],
    device: "Samsung Galaxy S23",
    browser: "Chrome Mobile",
    deviceType: "mobile",
    ipAddress: "77.88.99.100",
    location: "Moscow, RU",
    country: "RU",
    city: "Moscow",
    loginTime: "2024-01-15T11:30:00Z",
    lastActivity: "2024-01-15T14:28:00Z",
    status: "active",
    mfaEnabled: true,
    mfaVerified: true,
    riskScore: 75,
    isSuspicious: true,
  },
  {
    id: "sess-008",
    userId: "usr-008",
    displayName: "Jennifer Martinez",
    email: "jennifer.martinez@acme.com",
    groups: ["Product"],
    device: "Windows Laptop",
    browser: "Edge 120",
    deviceType: "desktop",
    ipAddress: "198.51.100.25",
    location: "Toronto, CA",
    country: "CA",
    city: "Toronto",
    loginTime: "2024-01-15T14:00:00Z",
    lastActivity: "2024-01-15T14:30:00Z",
    status: "active",
    mfaEnabled: false,
    mfaVerified: false,
    riskScore: 40,
    isSuspicious: false,
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatDuration(startTime: string, endTime?: string): string {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffHours > 0) {
    return `${diffHours}h ${diffMins % 60}m`;
  }
  return `${diffMins}m`;
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return formatDateTime(dateString);
}

// ============================================================================
// CONFIGURATION & BADGE COMPONENTS
// ============================================================================

const statusConfig = {
  active: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    label: "Active",
  },
  idle: {
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    label: "Idle",
  },
  terminated: {
    icon: XCircle,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    label: "Terminated",
  },
};

function StatusBadge({ status }: { status: UserSession["status"] }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.bgColor,
        config.color,
        config.borderColor,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function MfaBadge({
  enabled,
  verified,
}: {
  enabled: boolean;
  verified: boolean;
}) {
  if (enabled && verified) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
        <ShieldCheck className="h-3 w-3" />
        Verified
      </span>
    );
  }
  if (enabled && !verified) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
        <Shield className="h-3 w-3" />
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
      <Shield className="h-3 w-3" />
      Disabled
    </span>
  );
}

function RiskBadge({
  score,
  isSuspicious,
}: {
  score?: number;
  isSuspicious?: boolean;
}) {
  if (isSuspicious || (score && score >= 70)) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-700 border border-red-200">
        <AlertTriangle className="h-3 w-3" />
        High Risk
      </span>
    );
  }
  if (score && score >= 40) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
        <AlertCircle className="h-3 w-3" />
        Medium
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
      <ShieldCheck className="h-3 w-3" />
      Low
    </span>
  );
}

function DeviceIcon({ type }: { type: UserSession["deviceType"] }) {
  const icons = {
    desktop: Laptop,
    mobile: Smartphone,
    tablet: Tablet,
  };
  const Icon = icons[type];
  return <Icon className="h-4 w-4 text-muted-foreground" />;
}

// ============================================================================
// KPI CARD COMPONENT
// ============================================================================

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
}: KpiCardProps) {
  const variantStyles = {
    default: {
      iconBg: "bg-muted",
      iconColor: "text-muted-foreground",
      valueColor: "text-foreground",
    },
    success: {
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    warning: {
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      valueColor: "text-amber-600",
    },
    danger: {
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      valueColor: "text-red-600",
    },
    info: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      valueColor: "text-blue-600",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
            <p className={cn("text-2xl font-bold", styles.valueColor)}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn("rounded-lg p-2", styles.iconBg)}>
            <Icon className={cn("h-4 w-4", styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SESSION DETAILS DIALOG
// ============================================================================

interface SessionDetailsDialogProps {
  session: UserSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTerminate: (sessionId: string) => void;
}

function SessionDetailsDialog({
  session,
  open,
  onOpenChange,
  onTerminate,
}: SessionDetailsDialogProps) {
  const [isTerminating, setIsTerminating] = useState(false);

  if (!session) return null;

  const handleTerminate = async () => {
    setIsTerminating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onTerminate(session.id);
    setIsTerminating(false);
    onOpenChange(false);
  };

  const initials = session.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Session Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about the active session and security context.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Info Header */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border">
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary border border-primary/20">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">
                  {session.displayName}
                </h3>
                <StatusBadge status={session.status} />
              </div>
              <p className="text-sm text-muted-foreground">{session.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {session.groups.map((group) => (
                  <span
                    key={group}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border/50"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-mono">
                {session.id}
              </p>
              <p className="text-xs text-muted-foreground">{session.userId}</p>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="text-xs">
                <Activity className="h-3.5 w-3.5 mr-1.5" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="security" className="text-xs">
                <Shield className="h-3.5 w-3.5 mr-1.5" />
                Security
              </TabsTrigger>
              <TabsTrigger value="timeline" className="text-xs">
                <History className="h-3.5 w-3.5 mr-1.5" />
                Timeline
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* Device Info */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <DeviceIcon type={session.deviceType} />
                  Device Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Device</span>
                    <p className="font-medium">{session.device}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Browser</span>
                    <p className="font-medium">{session.browser}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Type</span>
                    <p className="font-medium capitalize">
                      {session.deviceType}
                    </p>
                  </div>
                </div>
              </section>

              {/* Location Info */}
              <section className="pt-4 border-t">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  Location & Network
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">IP Address</span>
                    <p className="font-mono text-xs bg-muted px-2 py-1 rounded inline-block">
                      {session.ipAddress}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Location</span>
                    <p className="font-medium">
                      {session.location || "Unknown"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Session Timing */}
              <section className="pt-4 border-t">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  Session Timing
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Login Time</span>
                    <p className="font-medium">
                      {formatDateTime(session.loginTime)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Last Activity</span>
                    <p className="font-medium">
                      {getRelativeTime(session.lastActivity)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">
                      Session Duration
                    </span>
                    <p className="font-medium">
                      {formatDuration(session.loginTime)}
                    </p>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="security" className="space-y-4 mt-4">
              {/* MFA Status */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Authentication
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg border bg-card">
                    <span className="text-sm">MFA Status</span>
                    <MfaBadge
                      enabled={session.mfaEnabled}
                      verified={session.mfaVerified}
                    />
                  </div>
                </div>
              </section>

              {/* Risk Assessment */}
              <section className="pt-4 border-t">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Risk Assessment
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg border bg-card">
                    <span className="text-sm">Risk Level</span>
                    <RiskBadge
                      score={session.riskScore}
                      isSuspicious={session.isSuspicious}
                    />
                  </div>
                  {session.riskScore && (
                    <div className="p-3 rounded-lg border bg-muted/30">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-muted-foreground">
                          Risk Score
                        </span>
                        <span className="text-sm font-medium">
                          {session.riskScore}/100
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all",
                            session.riskScore >= 70
                              ? "bg-red-500"
                              : session.riskScore >= 40
                                ? "bg-amber-500"
                                : "bg-emerald-500",
                          )}
                          style={{ width: `${session.riskScore}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {session.isSuspicious && (
                    <div className="p-3 rounded-lg border border-red-200 bg-red-50">
                      <div className="flex items-center gap-2 text-red-700">
                        <ShieldAlert className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Suspicious Activity Detected
                        </span>
                      </div>
                      <p className="text-xs text-red-600 mt-1">
                        This session has been flagged due to unusual location or
                        behavior patterns.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Permissions Snapshot (Placeholder) */}
              <section className="pt-4 border-t">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5" />
                  Permissions Snapshot
                </h4>
                <div className="p-3 rounded-lg border bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    Effective permissions will be displayed here based on group
                    memberships and role assignments.
                  </p>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4 mt-4">
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <History className="h-3.5 w-3.5" />
                  Activity Timeline
                </h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <div className="w-px h-full bg-border mt-1" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">Session Started</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(session.loginTime)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        User authenticated successfully
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <div className="w-px h-full bg-border mt-1" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">Last Activity</p>
                      <p className="text-xs text-muted-foreground">
                        {getRelativeTime(session.lastActivity)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        User interaction detected
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-muted" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Current Status
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Session {session.status}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {session.status !== "terminated" && (
            <Button
              variant="destructive"
              onClick={handleTerminate}
              disabled={isTerminating}
            >
              {isTerminating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Terminating...
                </>
              ) : (
                <>
                  <PowerOff className="h-4 w-4 mr-2" />
                  Terminate Session
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// TERMINATE ALL DIALOG
// ============================================================================

interface TerminateAllDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionCount: number;
  onConfirm: () => void;
}

function TerminateAllDialog({
  open,
  onOpenChange,
  sessionCount,
  onConfirm,
}: TerminateAllDialogProps) {
  const [isTerminating, setIsTerminating] = useState(false);

  const handleConfirm = async () => {
    setIsTerminating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onConfirm();
    setIsTerminating(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Terminate All Sessions
          </DialogTitle>
          <DialogDescription>
            This action will terminate {sessionCount} active session
            {sessionCount !== 1 ? "s" : ""}. All affected users will be logged
            out immediately and will need to re-authenticate.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Warning</p>
              <p className="text-xs text-red-600 mt-1">
                This action cannot be undone. Users may lose unsaved work.
                Consider notifying users before proceeding.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isTerminating}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isTerminating}
          >
            {isTerminating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Terminating...
              </>
            ) : (
              <>
                <PowerOff className="h-4 w-4 mr-2" />
                Terminate All
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function SessionsPage() {
  const [sessions, setSessions] = useState<UserSession[]>(mockSessions);
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTerminateAllOpen, setIsTerminateAllOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    UserSession["status"] | "all"
  >("all");
  const [riskFilter, setRiskFilter] = useState<
    "all" | "high" | "medium" | "low"
  >("all");
  const [deviceFilter, setDeviceFilter] = useState<
    UserSession["deviceType"] | "all"
  >("all");
  const [sortBy, setSortBy] = useState<
    "lastActivity" | "loginTime" | "riskScore"
  >("lastActivity");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Statistics
  const stats: SessionStats = useMemo(() => {
    const active = sessions.filter((s) => s.status === "active").length;
    const idle = sessions.filter((s) => s.status === "idle").length;
    const highRisk = sessions.filter(
      (s) => s.isSuspicious || (s.riskScore && s.riskScore >= 70),
    ).length;
    const mfaProtected = sessions.filter(
      (s) => s.mfaEnabled && s.mfaVerified,
    ).length;

    return {
      totalActive: active + idle,
      idleSessions: idle,
      highRiskSessions: highRisk,
      mfaProtected,
    };
  }, [sessions]);

  // Filtered and sorted sessions
  const filteredSessions = useMemo(() => {
    let result = sessions.filter((session) => {
      const matchesSearch =
        searchQuery === "" ||
        session.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.ipAddress.includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" || session.status === statusFilter;

      const matchesRisk =
        riskFilter === "all" ||
        (riskFilter === "high" &&
          (session.isSuspicious ||
            (session.riskScore && session.riskScore >= 70))) ||
        (riskFilter === "medium" &&
          session.riskScore &&
          session.riskScore >= 40 &&
          session.riskScore < 70) ||
        (riskFilter === "low" &&
          (!session.riskScore || session.riskScore < 40));

      const matchesDevice =
        deviceFilter === "all" || session.deviceType === deviceFilter;

      return matchesSearch && matchesStatus && matchesRisk && matchesDevice;
    });

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "lastActivity":
          comparison =
            new Date(a.lastActivity).getTime() -
            new Date(b.lastActivity).getTime();
          break;
        case "loginTime":
          comparison =
            new Date(a.loginTime).getTime() - new Date(b.loginTime).getTime();
          break;
        case "riskScore":
          comparison = (a.riskScore || 0) - (b.riskScore || 0);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [
    sessions,
    searchQuery,
    statusFilter,
    riskFilter,
    deviceFilter,
    sortBy,
    sortOrder,
  ]);

  // Handlers
  const handleViewDetails = (session: UserSession) => {
    setSelectedSession(session);
    setIsDetailsOpen(true);
  };

  const handleTerminateSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, status: "terminated" } : s,
      ),
    );
  };

  const handleTerminateAll = () => {
    setSessions((prev) =>
      prev.map((s) =>
        s.status !== "terminated" ? { ...s, status: "terminated" } : s,
      ),
    );
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setRiskFilter("all");
    setDeviceFilter("all");
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    riskFilter !== "all" ||
    deviceFilter !== "all";

  return (
    <div className="space-y-6 text-foreground">
      {/* =========================================================================
          HEADER SECTION
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-card-foreground">
                Identity Active Sessions
              </h1>
              <Badge variant="secondary" className="text-xs">
                {stats.totalActive} active
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Monitor and control active user sessions across the organization.
              Review session details, identify risks, and terminate sessions
              when necessary.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")}
              />
              Refresh
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsTerminateAllOpen(true)}
              disabled={stats.totalActive === 0}
            >
              <PowerOff className="h-4 w-4 mr-2" />
              Terminate All
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          KPI SECTION
          ========================================================================= */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Active Sessions"
            value={stats.totalActive}
            subtitle="Currently logged in"
            icon={Monitor}
            variant="info"
          />
          <KpiCard
            title="Idle Sessions"
            value={stats.idleSessions}
            subtitle="Inactive for 30+ min"
            icon={Clock}
            variant="warning"
          />
          <KpiCard
            title="High Risk"
            value={stats.highRiskSessions}
            subtitle="Requires attention"
            icon={AlertTriangle}
            variant={stats.highRiskSessions > 0 ? "danger" : "default"}
          />
          <KpiCard
            title="MFA Protected"
            value={stats.mfaProtected}
            subtitle={`${Math.round((stats.mfaProtected / (stats.totalActive || 1)) * 100)}% of sessions`}
            icon={ShieldCheck}
            variant="success"
          />
        </div>
      </section>

      {/* =========================================================================
          FILTERS & SEARCH SECTION
          ========================================================================= */}
      <section className="space-y-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, device, or IP address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
              >
                <SelectTrigger className="w-35">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="idle">Idle</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={riskFilter}
                onValueChange={(v) => setRiskFilter(v as typeof riskFilter)}
              >
                <SelectTrigger className="w-35">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={deviceFilter}
                onValueChange={(v) => setDeviceFilter(v as typeof deviceFilter)}
              >
                <SelectTrigger className="w-35">
                  <SelectValue placeholder="Device Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 ml-auto">
                <Select
                  value={sortBy}
                  onValueChange={(v) => setSortBy(v as typeof sortBy)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lastActivity">Last Activity</SelectItem>
                    <SelectItem value="loginTime">Login Time</SelectItem>
                    <SelectItem value="riskScore">Risk Score</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  {sortOrder === "asc" ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Active Filters Indicator */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Showing {filteredSessions.length} of {sessions.length}{" "}
                  sessions
                </span>
                <button
                  onClick={clearFilters}
                  className="ml-auto text-xs text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* =========================================================================
          SESSIONS TABLE SECTION
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Session List
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Card className="border-border overflow-hidden">
          {filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Monitor className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                No sessions found
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                {hasActiveFilters
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "There are no active sessions to display at the moment."}
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Groups</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Login Time</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>MFA</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead className="w-25">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => (
                    <TableRow
                      key={session.id}
                      className={cn(
                        "cursor-pointer",
                        session.isSuspicious && "bg-red-50/50 hover:bg-red-50",
                      )}
                      onClick={() => handleViewDetails(session)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                            {session.displayName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {session.displayName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {session.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {session.groups.slice(0, 2).map((group) => (
                            <span
                              key={group}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border"
                            >
                              {group}
                            </span>
                          ))}
                          {session.groups.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{session.groups.length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DeviceIcon type={session.deviceType} />
                          <div>
                            <p className="text-sm">{session.device}</p>
                            <p className="text-xs text-muted-foreground">
                              {session.browser}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                          <div>
                            <p className="text-sm">
                              {session.location || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {session.ipAddress}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm" suppressHydrationWarning>
                          {formatTime(session.loginTime)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm" suppressHydrationWarning>
                          {getRelativeTime(session.lastActivity)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={session.status} />
                      </TableCell>
                      <TableCell>
                        <MfaBadge
                          enabled={session.mfaEnabled}
                          verified={session.mfaVerified}
                        />
                      </TableCell>
                      <TableCell>
                        <RiskBadge
                          score={session.riskScore}
                          isSuspicious={session.isSuspicious}
                        />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(session)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleTerminateSession(session.id)}
                              disabled={session.status === "terminated"}
                            >
                              <PowerOff className="h-4 w-4 mr-2" />
                              Terminate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </section>

      {/* =========================================================================
          REPORTS & AUDIT SECTION (Placeholder)
          ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Reports & Audit
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-dashed border-2 border-border/50 bg-muted/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Session Report</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Generate detailed session activity reports for compliance
                    and audit purposes.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                disabled
              >
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-border/50 bg-muted/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Risk Analysis</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    View comprehensive risk analysis and anomaly detection
                    reports.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                disabled
              >
                <Eye className="h-4 w-4 mr-2" />
                View Analysis
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-border/50 bg-muted/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <History className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Session History</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Access historical session data and terminated session logs.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                disabled
              >
                <History className="h-4 w-4 mr-2" />
                View History
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* =========================================================================
          FUTURE FEATURES SECTION
          ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Coming Soon
        </h2>
        <Card className="border-dashed border-2 border-border/50 bg-muted/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Enhanced Security Features</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Future enhancements include MFA enforcement policies,
                  real-time risk scoring, device trust verification, and
                  conditional access rules.
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>MFA Enforcement</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Risk Scoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Device Trust</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="h-3.5 w-3.5" />
                    <span>Conditional Access</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* =========================================================================
          DIALOGS
          ========================================================================= */}
      <SessionDetailsDialog
        session={selectedSession}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onTerminate={handleTerminateSession}
      />

      <TerminateAllDialog
        open={isTerminateAllOpen}
        onOpenChange={setIsTerminateAllOpen}
        sessionCount={stats.totalActive}
        onConfirm={handleTerminateAll}
      />
    </div>
  );
}
