"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { MetricCard } from "@/components/dashboard/metric-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/dashboard/ui/tabs";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import { Input } from "@/components/dashboard/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/dashboard/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/dashboard/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  RefreshCw,
  Search,
  Clock,
  MapPin,
  Globe,
  Server,
  Smartphone,
  Users,
  Key,
  Lock,
  Activity,
  Eye,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccessEvent {
  id: string;
  timestamp: string;
  decision: "allow" | "deny" | "challenge";
  subjectType:
    | "user"
    | "machine"
    | "device"
    | "service"
    | "api_client"
    | "network"
    | "inter_org";
  subjectId: string;
  subjectName: string;
  subjectEmail?: string;
  resourceType:
    | "api"
    | "application"
    | "database"
    | "network"
    | "file"
    | "service"
    | "infrastructure";
  resourceId: string;
  resourceName: string;
  action: string;
  policyId?: string;
  policyName?: string;
  decisionReason?: string;
  context: {
    ipAddress: string;
    location?: {
      country: string;
      city: string;
      coordinates?: { lat: number; lng: number };
    };
    deviceId?: string;
    deviceType?: "desktop" | "mobile" | "tablet" | "iot" | "server";
    deviceTrustLevel?: "trusted" | "managed" | "unknown" | "untrusted";
    userAgent?: string;
    environment?: "production" | "staging" | "development" | "sandbox";
    sessionId?: string;
    mfaUsed: boolean;
    mfaMethods?: string[];
    riskScore?: number;
    riskFactors?: string[];
  };
  metadata?: Record<string, unknown>;
}

export interface AccessSummary {
  totalAccess: number;
  allowCount: number;
  denyCount: number;
  challengeCount: number;
  denyRate: number;
  challengeRate: number;
  uniqueSubjects: number;
  uniqueResources: number;
  uniquePolicies: number;
  averageRiskScore: number;
  topDeniedSubjects: Array<{
    subjectId: string;
    subjectName: string;
    denyCount: number;
  }>;
  topDeniedResources: Array<{
    resourceId: string;
    resourceName: string;
    denyCount: number;
  }>;
  topDeniedPolicies: Array<{
    policyId: string;
    policyName: string;
    denyCount: number;
  }>;
  trend: Array<{
    date: string;
    allow: number;
    deny: number;
    challenge: number;
  }>;
  bySubjectType: Array<{ type: string; count: number }>;
  byResourceType: Array<{ type: string; count: number }>;
  byEnvironment: Array<{ environment: string; count: number }>;
  byDecision: Array<{ decision: string; count: number; percentage: number }>;
  byRiskLevel: Array<{ level: string; count: number }>;
}

export interface AccessFilters {
  subject?: string;
  resource?: string;
  decision?: "all" | "allow" | "deny" | "challenge";
  policy?: string;
  environment?: string;
  subjectType?: string;
  riskLevel?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

const DECISION_COLORS = {
  allow: "#22c55e",
  deny: "#ef4444",
  challenge: "#f59e0b",
};

const RISK_COLORS = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
  critical: "#7f1d1d",
};

const SUBJECT_TYPE_ICONS: Record<string, React.ElementType> = {
  user: Users,
  machine: Server,
  device: Smartphone,
  service: Globe,
  api_client: Key,
  network: Shield,
  inter_org: Globe,
};

function AccessEventDetailDialog({
  event,
  onClose,
}: {
  event: AccessEvent;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  event.decision === "allow"
                    ? "bg-green-500/10 text-green-500"
                    : event.decision === "deny"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-yellow-500/10 text-yellow-500",
                )}
              >
                {event.decision === "allow" ? (
                  <ShieldCheck className="h-5 w-5" />
                ) : event.decision === "deny" ? (
                  <ShieldX className="h-5 w-5" />
                ) : (
                  <ShieldAlert className="h-5 w-5" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">Access Event Details</CardTitle>
                <CardDescription>ID: {event.id}</CardDescription>
              </div>
            </div>
            <Badge
              variant={
                event.decision === "allow"
                  ? "secondary"
                  : event.decision === "deny"
                    ? "destructive"
                    : "default"
              }
              className={cn(
                event.decision === "allow" &&
                  "bg-green-500/10 text-green-500 border-green-500/20",
                event.decision === "challenge" &&
                  "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
              )}
            >
              {event.decision.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" /> Subject Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Type</span>
                  <span className="capitalize">{event.subjectType}</span>
                </div>
                <div className="flex justify-between">
                  <span>ID</span>
                  <code className="text-xs">{event.subjectId}</code>
                </div>
                <div className="flex justify-between">
                  <span>Name</span>
                  <span>{event.subjectName}</span>
                </div>
                {event.subjectEmail && (
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span>{event.subjectEmail}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Server className="h-4 w-4" /> Resource Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Type</span>
                  <span className="capitalize">{event.resourceType}</span>
                </div>
                <div className="flex justify-between">
                  <span>ID</span>
                  <code className="text-xs">{event.resourceId}</code>
                </div>
                <div className="flex justify-between">
                  <span>Name</span>
                  <span>{event.resourceName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Action</span>
                  <Badge variant="outline">{event.action}</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" /> Decision Details
              </h4>
              <div className="space-y-2 text-sm">
                {event.policyId && (
                  <div className="flex justify-between">
                    <span>Policy ID</span>
                    <code className="text-xs">{event.policyId}</code>
                  </div>
                )}
                {event.policyName && (
                  <div className="flex justify-between">
                    <span>Policy</span>
                    <span>{event.policyName}</span>
                  </div>
                )}
                {event.decisionReason && (
                  <div className="flex justify-between">
                    <span>Reason</span>
                    <span className="text-right max-w-[200px]">
                      {event.decisionReason}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Context Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>IP Address</span>
                  <code className="text-xs">{event.context.ipAddress}</code>
                </div>
                {event.context.location && (
                  <div className="flex justify-between">
                    <span>Location</span>
                    <span>
                      {event.context.location.city},{" "}
                      {event.context.location.country}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>MFA Used</span>
                  {event.context.mfaUsed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                {event.context.riskScore !== undefined && (
                  <div className="flex justify-between">
                    <span>Risk Score</span>
                    <Badge
                      variant={
                        event.context.riskScore >= 70
                          ? "destructive"
                          : event.context.riskScore >= 40
                            ? "default"
                            : "secondary"
                      }
                    >
                      {event.context.riskScore}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" asChild>
              <a href={`/security/audit?eventId=${event.id}`}>
                <FileText className="h-4 w-4 mr-2" /> View in Audit
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AccessTrendChart({ data }: { data: AccessSummary["trend"] }) {
  return (
    <ChartContainer config={{}} className="h-[300px]">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          className="text-xs"
          tickLine={false}
          axisLine={false}
        />
        <YAxis className="text-xs" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="allow"
          stroke="#22c55e"
          strokeWidth={2}
          dot={false}
          name="Allow"
        />
        <Line
          type="monotone"
          dataKey="deny"
          stroke="#ef4444"
          strokeWidth={2}
          dot={false}
          name="Deny"
        />
        <Line
          type="monotone"
          dataKey="challenge"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={false}
          name="Challenge"
        />
      </LineChart>
    </ChartContainer>
  );
}

function AccessDecisionChart({ data }: { data: AccessSummary["byDecision"] }) {
  return (
    <ChartContainer config={{}} className="h-[250px]">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="count"
          nameKey="decision"
          label={({ decision, percentage }) => `${decision}: ${percentage}%`}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                DECISION_COLORS[
                  entry.decision as keyof typeof DECISION_COLORS
                ] || "#6b7280"
              }
            />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  );
}

function AccessBySubjectTypeChart({
  data,
}: {
  data: AccessSummary["bySubjectType"];
}) {
  return (
    <ChartContainer config={{}} className="h-[250px]">
      <BarChart data={data} layout="vertical">
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-muted"
          horizontal={false}
        />
        <XAxis
          type="number"
          className="text-xs"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          dataKey="type"
          type="category"
          className="text-xs"
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="currentColor" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

function AccessByEnvironmentChart({
  data,
}: {
  data: AccessSummary["byEnvironment"];
}) {
  return (
    <ChartContainer config={{}} className="h-[250px]">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="environment"
          className="text-xs"
          tickLine={false}
          axisLine={false}
        />
        <YAxis className="text-xs" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="currentColor" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

function RiskDistributionChart({
  data,
}: {
  data: AccessSummary["byRiskLevel"];
}) {
  return (
    <ChartContainer config={{}} className="h-[200px]">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="level"
          className="text-xs"
          tickLine={false}
          axisLine={false}
        />
        <YAxis className="text-xs" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="currentColor" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                RISK_COLORS[entry.level as keyof typeof RISK_COLORS] ||
                "#6b7280"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

function AccessEventsTable({
  events,
  onViewDetail,
}: {
  events: AccessEvent[];
  onViewDetail: (event: AccessEvent) => void;
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Decision</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Context</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => {
            const SubjectIcon = SUBJECT_TYPE_ICONS[event.subjectType] || Shield;
            return (
              <TableRow key={event.id}>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      event.decision === "allow"
                        ? "secondary"
                        : event.decision === "deny"
                          ? "destructive"
                          : "default"
                    }
                    className={cn(
                      event.decision === "allow" &&
                        "bg-green-500/10 text-green-500 border-green-500/20",
                      event.decision === "challenge" &&
                        "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                    )}
                  >
                    {event.decision === "allow" && (
                      <ShieldCheck className="h-3 w-3 mr-1" />
                    )}
                    {event.decision === "deny" && (
                      <ShieldX className="h-3 w-3 mr-1" />
                    )}
                    {event.decision === "challenge" && (
                      <ShieldAlert className="h-3 w-3 mr-1" />
                    )}
                    {event.decision}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <SubjectIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{event.subjectName}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {event.subjectType}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{event.resourceName}</div>
                    <div className="text-xs text-muted-foreground">
                      {event.resourceType}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{event.action}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {event.context.location
                      ? `${event.context.location.country}`
                      : event.context.ipAddress}
                    {event.context.mfaUsed && (
                      <span
                        className="text-green-500 ml-1"
                        title="MFA verified"
                      >
                        ✓
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetail(event)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function DeniedAccessSection({
  deniedEvents,
}: {
  deniedEvents: AccessEvent[];
}) {
  const highRiskDenied = deniedEvents.filter(
    (e) => (e.context.riskScore || 0) >= 70,
  );
  const mfaChallenges = deniedEvents.filter((e) => e.decision === "challenge");
  const policyViolations = deniedEvents.filter((e) => e.policyId);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Denied Access</CardTitle>
          <ShieldX className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{deniedEvents.length}</div>
          <p className="text-xs text-muted-foreground">Total denied events</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            High Risk Denials
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{highRiskDenied.length}</div>
          <p className="text-xs text-muted-foreground">Risk score ≥ 70</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">MFA Challenges</CardTitle>
          <Lock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mfaChallenges.length}</div>
          <p className="text-xs text-muted-foreground">
            Requiring verification
          </p>
        </CardContent>
      </Card>

      {policyViolations.length > 0 && (
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Policy Violations</CardTitle>
            <CardDescription>
              Denied access due to policy enforcement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {policyViolations.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <ShieldX className="h-4 w-4 text-red-500" />
                    <div>
                      <div className="font-medium">{event.subjectName}</div>
                      <div className="text-sm text-muted-foreground">
                        Attempted {event.action} on {event.resourceName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {event.policyName && (
                      <Badge variant="outline">{event.policyName}</Badge>
                    )}
                    {event.decisionReason && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {event.decisionReason}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function FilterBar({
  filters,
  onFiltersChange,
  onExport,
}: {
  filters: AccessFilters;
  onFiltersChange: (filters: AccessFilters) => void;
  onExport: (format: "csv" | "json" | "pdf") => void;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects, resources..."
            className="pl-9"
            value={filters.search || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
          />
        </div>
        <Select
          value={filters.decision || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              decision: value as AccessFilters["decision"],
            })
          }
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Decision" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Decisions</SelectItem>
            <SelectItem value="allow">Allow</SelectItem>
            <SelectItem value="deny">Deny</SelectItem>
            <SelectItem value="challenge">Challenge</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.subjectType || "all"}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, subjectType: value })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Subject Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="machine">Machine</SelectItem>
            <SelectItem value="device">Device</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="api_client">API Client</SelectItem>
            <SelectItem value="network">Network</SelectItem>
            <SelectItem value="inter_org">Inter-Org</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.environment || "all"}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, environment: value })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Environments</SelectItem>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="staging">Staging</SelectItem>
            <SelectItem value="development">Development</SelectItem>
            <SelectItem value="sandbox">Sandbox</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.riskLevel || "all"}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, riskLevel: value })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
        <Select
          onValueChange={(value) => onExport(value as "csv" | "json" | "pdf")}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Export" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> CSV
              </div>
            </SelectItem>
            <SelectItem value="json">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" /> JSON
              </div>
            </SelectItem>
            <SelectItem value="pdf">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> PDF
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function Code({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      className={cn("bg-muted p-4 rounded-lg overflow-x-auto", className)}
      {...props}
    />
  );
}

function TimeDisplay() {
  const [time, setTime] = React.useState<string>("");

  React.useEffect(() => {
    setTime(new Date().toLocaleString());
  }, []);

  return <span suppressHydrationWarning>{time}</span>;
}

function MetricCards({ summary }: { summary: AccessSummary }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Access"
        value={summary.totalAccess.toLocaleString()}
        icon={Shield}
        variant="default"
        trend={{ value: 12.5, isPositive: true }}
        subtitle="Last 7 days"
      />
      <MetricCard
        title="Allow Rate"
        value={`${100 - summary.denyRate - summary.challengeRate}%`}
        icon={ShieldCheck}
        variant="accent"
        trend={{ value: 2.3, isPositive: true }}
        subtitle={`${summary.allowCount.toLocaleString()} allowed`}
      />
      <MetricCard
        title="Deny Rate"
        value={`${summary.denyRate}%`}
        icon={ShieldX}
        variant="destructive"
        trend={{ value: 0.8, isPositive: false }}
        subtitle={`${summary.denyCount.toLocaleString()} denied`}
      />
      <MetricCard
        title="Avg Risk Score"
        value={summary.averageRiskScore}
        icon={Activity}
        variant="warning"
        trend={{ value: 5.2, isPositive: false }}
        subtitle="Across all events"
      />
    </div>
  );
}

export default function AccessReportPage() {
  const [filters, setFilters] = React.useState<AccessFilters>({});
  const [selectedEvent, setSelectedEvent] = React.useState<AccessEvent | null>(
    null,
  );
  const [activeTab, setActiveTab] = React.useState("overview");

  // Mock data - in production, these would come from API hooks
  const summary: AccessSummary = {
    totalAccess: 45892,
    allowCount: 42156,
    denyCount: 2847,
    challengeCount: 889,
    denyRate: 6.2,
    challengeRate: 1.9,
    uniqueSubjects: 1247,
    uniqueResources: 892,
    uniquePolicies: 156,
    averageRiskScore: 23,
    topDeniedSubjects: [
      {
        subjectId: "svc-123",
        subjectName: "legacy-api-connector",
        denyCount: 234,
      },
      {
        subjectId: "user-456",
        subjectName: "john.doe@example.com",
        denyCount: 89,
      },
      {
        subjectId: "svc-789",
        subjectName: "migration-worker-v2",
        denyCount: 67,
      },
    ],
    topDeniedResources: [
      {
        resourceId: "res-db-prod",
        resourceName: "production-database",
        denyCount: 456,
      },
      {
        resourceId: "res-api-admin",
        resourceName: "admin-api-endpoint",
        denyCount: 312,
      },
      {
        resourceId: "res-s3-sensitive",
        resourceName: "s3-sensitive-bucket",
        denyCount: 198,
      },
    ],
    topDeniedPolicies: [
      {
        policyId: "pol-001",
        policyName: "Require MFA for Production",
        denyCount: 567,
      },
      {
        policyId: "pol-002",
        policyName: "IP Whitelist - Corporate",
        denyCount: 234,
      },
      {
        policyId: "pol-003",
        policyName: "Time-based Access Window",
        denyCount: 189,
      },
    ],
    trend: [
      { date: "2024-01-01", allow: 1423, deny: 89, challenge: 23 },
      { date: "2024-01-02", allow: 1567, deny: 102, challenge: 34 },
      { date: "2024-01-03", allow: 1342, deny: 78, challenge: 28 },
      { date: "2024-01-04", allow: 1678, deny: 112, challenge: 45 },
      { date: "2024-01-05", allow: 1523, deny: 95, challenge: 31 },
      { date: "2024-01-06", allow: 1892, deny: 134, challenge: 52 },
      { date: "2024-01-07", allow: 1456, deny: 87, challenge: 29 },
    ],
    bySubjectType: [
      { type: "user", count: 23456 },
      { type: "service", count: 12345 },
      { type: "machine", count: 5678 },
      { type: "device", count: 2345 },
      { type: "api_client", count: 1234 },
      { type: "network", count: 567 },
      { type: "inter_org", count: 267 },
    ],
    byResourceType: [
      { type: "api", count: 25678 },
      { type: "application", count: 10234 },
      { type: "database", count: 4567 },
      { type: "infrastructure", count: 2345 },
      { type: "network", count: 1567 },
      { type: "file", count: 1501 },
    ],
    byEnvironment: [
      { environment: "production", count: 28934 },
      { environment: "staging", count: 8976 },
      { environment: "development", count: 5342 },
      { environment: "sandbox", count: 2640 },
    ],
    byDecision: [
      { decision: "allow", count: 42156, percentage: 91.9 },
      { decision: "deny", count: 2847, percentage: 6.2 },
      { decision: "challenge", count: 889, percentage: 1.9 },
    ],
    byRiskLevel: [
      { level: "low", count: 32456 },
      { level: "medium", count: 9876 },
      { level: "high", count: 2987 },
      { level: "critical", count: 573 },
    ],
  };

  const events: AccessEvent[] = [
    {
      id: "evt-001",
      timestamp: "2024-01-07T14:23:45Z",
      decision: "allow",
      subjectType: "user",
      subjectId: "user-123",
      subjectName: "alice.smith@example.com",
      subjectEmail: "alice.smith@example.com",
      resourceType: "api",
      resourceId: "api-dashboard",
      resourceName: "Dashboard API",
      action: "read:dashboard",
      policyId: "pol-mfa-required",
      policyName: "MFA Required Policy",
      decisionReason: "User authenticated with MFA",
      context: {
        ipAddress: "192.168.1.100",
        location: { country: "US", city: "San Francisco" },
        deviceType: "desktop",
        deviceTrustLevel: "managed",
        mfaUsed: true,
        mfaMethods: ["totp", "webauthn"],
        riskScore: 12,
        riskFactors: [],
        environment: "production",
        sessionId: "sess-abc123",
      },
    },
    {
      id: "evt-002",
      timestamp: "2024-01-07T14:22:31Z",
      decision: "deny",
      subjectType: "machine",
      subjectId: "svc-456",
      subjectName: "legacy-connector",
      resourceType: "infrastructure",
      resourceId: "infra-db-prod",
      resourceName: "Production Database",
      action: "admin:configure",
      policyId: "pol-ip-whitelist",
      policyName: "Corporate IP Whitelist",
      decisionReason: "IP address not in whitelist",
      context: {
        ipAddress: "203.0.113.50",
        location: { country: "CN", city: "Beijing" },
        deviceType: "server",
        deviceTrustLevel: "unknown",
        mfaUsed: false,
        riskScore: 85,
        riskFactors: ["unknown_ip", "non_corporate_network"],
        environment: "production",
        sessionId: "sess-def456",
      },
    },
    {
      id: "evt-003",
      timestamp: "2024-01-07T14:20:15Z",
      decision: "challenge",
      subjectType: "user",
      subjectId: "user-789",
      subjectName: "bob.jones@example.com",
      subjectEmail: "bob.jones@example.com",
      resourceType: "application",
      resourceId: "app-finance",
      resourceName: "Finance Application",
      action: "write:reports",
      policyId: "pol-mfa-sensitive",
      policyName: "Sensitive Action MFA",
      decisionReason: "Elevated risk detected",
      context: {
        ipAddress: "45.33.32.156",
        location: { country: "US", city: "Portland" },
        deviceType: "mobile",
        deviceTrustLevel: "unknown",
        mfaUsed: false,
        riskScore: 62,
        riskFactors: ["new_device", "unusual_location"],
        environment: "production",
        sessionId: "sess-ghi789",
      },
    },
  ];

  const deniedEvents: AccessEvent[] = events.filter(
    (e) => e.decision === "deny" || e.decision === "challenge",
  );

  const handleExport = (format: "csv" | "json" | "pdf") => {
    // In production, this would trigger the export API
    console.log(`Exporting access report as ${format}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Access Report</h1>
          <p className="text-muted-foreground">
            Monitor and analyze all access decisions across your infrastructure
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Last updated: </span>
          <TimeDisplay />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">All Events</TabsTrigger>
          <TabsTrigger value="denied">Denied Access</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <MetricCards summary={summary} />

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Access Trend</CardTitle>
                <CardDescription>
                  Allow, deny, and challenge decisions over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AccessTrendChart data={summary.trend} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Decision Distribution</CardTitle>
                <CardDescription>Breakdown by decision type</CardDescription>
              </CardHeader>
              <CardContent>
                <AccessDecisionChart data={summary.byDecision} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Access by Subject Type</CardTitle>
                <CardDescription>Volume by identity type</CardDescription>
              </CardHeader>
              <CardContent>
                <AccessBySubjectTypeChart data={summary.bySubjectType} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Access by Environment</CardTitle>
                <CardDescription>
                  Distribution across environments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AccessByEnvironmentChart data={summary.byEnvironment} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Events by risk level</CardDescription>
              </CardHeader>
              <CardContent>
                <RiskDistributionChart data={summary.byRiskLevel} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6 mt-6">
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            onExport={handleExport}
          />
          <AccessEventsTable events={events} onViewDetail={setSelectedEvent} />
        </TabsContent>

        <TabsContent value="denied" className="space-y-6 mt-6">
          <DeniedAccessSection deniedEvents={deniedEvents} />
          <Card>
            <CardHeader>
              <CardTitle>Denied Events Detail</CardTitle>
              <CardDescription>
                Full list of denied and challenged access attempts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AccessEventsTable
                events={deniedEvents}
                onViewDetail={setSelectedEvent}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6 mt-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Denied Subjects</CardTitle>
                <CardDescription>
                  Subjects with most denied access attempts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {summary.topDeniedSubjects.map((item, index) => (
                    <div
                      key={item.subjectId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{item.subjectName}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.subjectId}
                          </div>
                        </div>
                      </div>
                      <Badge variant="destructive">
                        {item.denyCount} denials
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Denied Resources</CardTitle>
                <CardDescription>
                  Most frequently targeted resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {summary.topDeniedResources.map((item, index) => (
                    <div
                      key={item.resourceId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{item.resourceName}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.resourceId}
                          </div>
                        </div>
                      </div>
                      <Badge variant="destructive">
                        {item.denyCount} denials
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Policy Enforcement</CardTitle>
              <CardDescription>
                Most active policies in access decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary.topDeniedPolicies.map((item, index) => (
                  <div
                    key={item.policyId}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{item.policyName}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.policyId}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{item.denyCount} denials</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedEvent && (
        <AccessEventDetailDialog
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
