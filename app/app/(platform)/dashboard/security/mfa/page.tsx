"use client";

import { useState } from "react";
import {
  Shield,
  Key,
  Smartphone,
  Mail,
  MessageSquare,
  Fingerprint,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  Users,
  Activity,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const mfaMethods = [
  {
    id: "totp",
    name: "Authenticator App",
    description: "Time-based one-time password (TOTP)",
    icon: Smartphone,
    enabled: true,
    users: 842,
    status: "active",
  },
  {
    id: "sms",
    name: "SMS",
    description: "One-time code via text message",
    icon: MessageSquare,
    enabled: true,
    users: 423,
    status: "active",
  },
  {
    id: "email",
    name: "Email",
    description: "One-time code via email",
    icon: Mail,
    enabled: true,
    users: 312,
    status: "active",
  },
  {
    id: "webauthn",
    name: "WebAuthn / Passkey",
    description: "Hardware key or device biometrics",
    icon: Fingerprint,
    enabled: true,
    users: 156,
    status: "beta",
  },
  {
    id: "backup",
    name: "Backup Codes",
    description: "Single-use backup codes",
    icon: Key,
    enabled: false,
    users: 0,
    status: "disabled",
  },
];

const mfaPolicies = [
  {
    id: "enforce-mfa",
    name: "Enforce MFA",
    description: "Require MFA for all users",
    enabled: true,
    scope: "all",
  },
  {
    id: "mfa-for-admin",
    name: "Admin MFA Required",
    description: "Enforce MFA for admin users",
    enabled: true,
    scope: "admin",
  },
  {
    id: "mfa-for-connections",
    name: "Connection-based MFA",
    description: "Require MFA for specific connections",
    enabled: false,
    scope: "custom",
  },
  {
    id: "adaptive-mfa",
    name: "Adaptive MFA",
    description: "Risk-based MFA challenges",
    enabled: true,
    scope: "adaptive",
  },
];

const recentMfaEvents = [
  {
    type: "mfa_success",
    user: "john.doe@example.com",
    method: "Authenticator App",
    time: "2 minutes ago",
    ip: "192.168.1.45",
    device: "Chrome on macOS",
  },
  {
    type: "mfa_challenge",
    user: "jane.smith@company.co",
    method: "SMS",
    time: "8 minutes ago",
    ip: "10.0.0.123",
    device: "Safari on iOS",
  },
  {
    type: "mfa_failed",
    user: "unknown@test.com",
    method: "Authenticator App",
    time: "15 minutes ago",
    ip: "203.45.67.89",
    device: "Unknown",
    reason: "Invalid code",
  },
  {
    type: "mfa_enrolled",
    user: "admin@etheriatimes.com",
    method: "WebAuthn",
    time: "22 minutes ago",
    ip: "172.16.0.55",
    device: "Chrome on Windows",
  },
  {
    type: "mfa_bypass",
    user: "api@service.io",
    method: "API Token",
    time: "31 minutes ago",
    ip: "10.0.0.1",
    device: "System",
  },
];

const mfaStats = {
  totalUsers: 12847,
  mfaEnabled: 4234,
  mfaPending: 892,
  challengesToday: 892,
  challengeRate: 98.2,
};

function getMfaEventIcon(type: string) {
  switch (type) {
    case "mfa_success":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "mfa_challenge":
      return <Shield className="h-4 w-4 text-blue-500" />;
    case "mfa_failed":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "mfa_enrolled":
      return <Key className="h-4 w-4 text-green-600" />;
    case "mfa_bypass":
      return <ShieldAlert className="h-4 w-4 text-yellow-500" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
}

function getMfaEventBadge(type: string) {
  switch (type) {
    case "mfa_success":
      return (
        <Badge variant="outline" className="text-xs font-normal">
          Success
        </Badge>
      );
    case "mfa_challenge":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs font-normal">
          Challenge
        </Badge>
      );
    case "mfa_failed":
      return (
        <Badge variant="destructive" className="text-xs font-normal">
          Failed
        </Badge>
      );
    case "mfa_enrolled":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs font-normal">
          Enrolled
        </Badge>
      );
    case "mfa_bypass":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs font-normal">
          Bypass
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="text-xs font-normal">
          Event
        </Badge>
      );
  }
}

export default function MfaPage() {
  const [methods, setMethods] = useState(mfaMethods);
  const [policies, setPolicies] = useState(mfaPolicies);
  const mfaEnabledPercent = (mfaStats.mfaEnabled / mfaStats.totalUsers) * 100;

  const toggleMethod = (id: string) => {
    setMethods(methods.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)));
  };

  const togglePolicy = (id: string) => {
    setPolicies(policies.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Identity MFA Authentication</h1>
            <p className="text-muted-foreground">
              Configure MFA methods, policies, and monitor authentication security.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Tabs defaultValue="methods" className="space-y-4">
          <TabsList>
            <TabsTrigger value="methods">MFA Methods</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="methods" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-3xl font-bold tracking-tight">
                        {mfaStats.totalUsers.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Users className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">MFA Enabled</p>
                      <p className="text-3xl font-bold tracking-tight">
                        {mfaStats.mfaEnabled.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <ShieldCheck className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Progress value={mfaEnabledPercent} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {mfaEnabledPercent.toFixed(1)}% of users
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Pending Enrollment
                      </p>
                      <p className="text-3xl font-bold tracking-tight">{mfaStats.mfaPending}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Challenge Rate</p>
                      <p className="text-3xl font-bold tracking-tight">{mfaStats.challengeRate}%</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Activity className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm">
                    <span className="text-muted-foreground">
                      {mfaStats.challengesToday} challenges today
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Authentication Methods
                    </CardTitle>
                    <CardDescription>Enable and configure available MFA methods</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Global Settings
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {methods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <method.icon className="h-5 w-5 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{method.name}</p>
                            {method.status === "beta" && (
                              <Badge variant="outline" className="text-xs">
                                Beta
                              </Badge>
                            )}
                            {method.status === "disabled" && (
                              <Badge variant="secondary" className="text-xs">
                                Disabled
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{method.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {method.enabled && (
                          <div className="text-right">
                            <p className="text-sm font-medium">{method.users} users</p>
                            <p className="text-xs text-muted-foreground">enrolled</p>
                          </div>
                        )}
                        <Switch
                          checked={method.enabled}
                          onCheckedChange={() => toggleMethod(method.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Customize MFA Challenge</CardTitle>
                  <CardDescription>Configure how MFA challenges are presented</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Code Length</label>
                    <Select defaultValue="6">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 digits</SelectItem>
                        <SelectItem value="6">6 digits</SelectItem>
                        <SelectItem value="8">8 digits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Code Expiration</label>
                    <Select defaultValue="300">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="180">3 minutes</SelectItem>
                        <SelectItem value="300">5 minutes</SelectItem>
                        <SelectItem value="600">10 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Maximum Attempts</label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 attempt</SelectItem>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                        <SelectItem value="10">10 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Branding Options</CardTitle>
                  <CardDescription>Customize the MFA pages shown to users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Custom Logo</p>
                      <p className="text-xs text-muted-foreground">
                        Display your logo on MFA pages
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Upload
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Background Color</p>
                      <p className="text-xs text-muted-foreground">Set MFA page background</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded border bg-white" />
                      <span className="text-xs text-muted-foreground">#FFFFFF</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">MFA Page Template</p>
                      <p className="text-xs text-muted-foreground">
                        Choose from branding templates
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href="/dashboard/branding/templates" className="gap-1">
                        Configure
                        <ChevronRight className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Active Policies</p>
                      <p className="text-3xl font-bold tracking-tight">
                        {policies.filter((p) => p.enabled).length}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <ShieldCheck className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">MFA Coverage</p>
                      <p className="text-3xl font-bold tracking-tight">
                        {mfaEnabledPercent.toFixed(0)}%
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Users className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                  <Progress value={mfaEnabledPercent} className="mt-4 h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                      <p className="text-3xl font-bold tracking-tight text-green-600">Low</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <ShieldAlert className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">MFA Policies</CardTitle>
                    <CardDescription>Configure when and how MFA is required</CardDescription>
                  </div>
                  <Button>
                    <Shield className="h-4 w-4 mr-2" />
                    Add Policy
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {policies.map((policy) => (
                    <div key={policy.id} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Shield className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{policy.name}</p>
                          <p className="text-xs text-muted-foreground">{policy.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            policy.scope === "all" && "border-blue-200 text-blue-700",
                            policy.scope === "admin" && "border-purple-200 text-purple-700",
                            policy.scope === "custom" && "border-orange-200 text-orange-700",
                            policy.scope === "adaptive" && "border-green-200 text-green-700"
                          )}
                        >
                          {policy.scope === "all" && "All Users"}
                          {policy.scope === "admin" && "Admins Only"}
                          {policy.scope === "custom" && "Custom"}
                          {policy.scope === "adaptive" && "Adaptive"}
                        </Badge>
                        <Switch
                          checked={policy.enabled}
                          onCheckedChange={() => togglePolicy(policy.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Risk-Based Authentication</CardTitle>
                <CardDescription>Configure adaptive MFA based on risk signals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">New Device Detection</p>
                    <p className="text-xs text-muted-foreground">Challenge MFA for new devices</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Unusual Location</p>
                    <p className="text-xs text-muted-foreground">
                      Challenge MFA for unexpected locations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Suspicious IP</p>
                    <p className="text-xs text-muted-foreground">
                      Challenge MFA for known malicious IPs
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Repeated Failures</p>
                    <p className="text-xs text-muted-foreground">
                      Challenge MFA after failed attempts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Challenges Today</p>
                      <p className="text-3xl font-bold tracking-tight">
                        {mfaStats.challengesToday}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Key className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Successful</p>
                      <p className="text-3xl font-bold tracking-tight">
                        {Math.round(mfaStats.challengesToday * (mfaStats.challengeRate / 100))}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Failed</p>
                      <p className="text-3xl font-bold tracking-tight">
                        {Math.round(
                          mfaStats.challengesToday * ((100 - mfaStats.challengeRate) / 100)
                        )}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Avg. Response</p>
                      <p className="text-3xl font-bold tracking-tight">1.2s</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Clock className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Recent MFA Events</CardTitle>
                    <CardDescription>Latest multi-factor authentication activity</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/dashboard/monitoring/logs" className="gap-1">
                      View all logs
                      <ChevronRight className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentMfaEvents.map((event, index) => (
                    <div key={index} className="flex items-start gap-3 px-6 py-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted mt-0.5">
                        {getMfaEventIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{event.user}</p>
                          {getMfaEventBadge(event.type)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{event.method}</span>
                          <span>-</span>
                          <span>{event.ip}</span>
                          <span>-</span>
                          <span>{event.device}</span>
                          {event.reason && (
                            <>
                              <span>-</span>
                              <span className="text-red-500">{event.reason}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {event.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
