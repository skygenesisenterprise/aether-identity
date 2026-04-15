"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ChevronRight,
  Eye,
  Fingerprint,
  Globe,
  Server,
  Zap,
  TrendingUp,
  Ban,
  Loader2,
  XCircle,
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { securityDashboardApi } from "@/lib/api/client";
import type { AttackProtection, ProtectionRule, BlockedIp, AttackEvent } from "@/lib/api/types";

const defaultProtectionStats: AttackProtection = {
  blockedToday: 1247,
  blockedThisWeek: 8934,
  activeRules: 12,
  suspiciousIPs: 45,
  attackAttempts: 234,
  normalTraffic: 12847,
  threatLevel: "moderate",
};

const defaultProtectionRules: ProtectionRule[] = [
  {
    id: "brute-force",
    name: "Brute Force Protection",
    description: "Detect and block repeated login attempts",
    enabled: true,
    severity: "high",
    blockedCount: 847,
  },
  {
    id: "rate-limiting",
    name: "Rate Limiting",
    description: "Limit requests per IP address",
    enabled: true,
    severity: "medium",
    blockedCount: 423,
  },
  {
    id: "suspicious-ip",
    name: "Suspicious IP Blocklist",
    description: "Block known malicious IP addresses",
    enabled: true,
    severity: "high",
    blockedCount: 156,
  },
  {
    id: "anomaly-detection",
    name: "Anomaly Detection",
    description: "Detect unusual login patterns",
    enabled: true,
    severity: "medium",
    blockedCount: 89,
  },
  {
    id: "geo-blocking",
    name: "Geographic Restrictions",
    description: "Block access from specific countries",
    enabled: false,
    severity: "low",
    blockedCount: 0,
  },
  {
    id: "device-fingerprint",
    name: "Device Fingerprinting",
    description: "Detect suspicious devices",
    enabled: true,
    severity: "low",
    blockedCount: 34,
  },
];

const defaultBlockedIPs: BlockedIp[] = [
  {
    ip: "192.168.1.100",
    country: "Unknown",
    reason: "Brute Force",
    attempts: 45,
    lastAttempt: "2 min ago",
    status: "active",
  },
  {
    ip: "10.0.0.55",
    country: "Unknown",
    reason: "Rate Limit",
    attempts: 123,
    lastAttempt: "5 min ago",
    status: "active",
  },
  {
    ip: "172.16.0.23",
    country: "CN",
    reason: "Blacklisted",
    attempts: 1,
    lastAttempt: "1 hour ago",
    status: "permanent",
  },
  {
    ip: "203.45.67.89",
    country: "RU",
    reason: "Anomaly",
    attempts: 8,
    lastAttempt: "3 hours ago",
    status: "active",
  },
  {
    ip: "198.51.100.12",
    country: "Unknown",
    reason: "Brute Force",
    attempts: 67,
    lastAttempt: "4 hours ago",
    status: "released",
  },
];

const defaultAttackEvents: AttackEvent[] = [
  {
    type: "blocked",
    source: "192.168.1.100",
    country: "Unknown",
    method: "Password Attack",
    target: "admin@aether.io",
    time: "2 minutes ago",
  },
  {
    type: "blocked",
    source: "10.0.0.55",
    country: "Unknown",
    method: "Rate Limit",
    target: "/api/auth/login",
    time: "5 minutes ago",
  },
  {
    type: "warning",
    source: "172.16.0.99",
    country: "Unknown",
    method: "Unusual Location",
    target: "john.doe@example.com",
    time: "12 minutes ago",
  },
  {
    type: "blocked",
    source: "203.45.67.89",
    country: "RU",
    method: "Geo Block",
    target: "/api/auth/login",
    time: "1 hour ago",
  },
  {
    type: "challenge",
    source: "198.51.100.45",
    country: "Unknown",
    method: "New Device",
    target: "jane.smith@company.co",
    time: "2 hours ago",
  },
];

const defaultSuspiciousCountries = [
  { code: "RU", name: "Russia", attempts: 234, blocked: true },
  { code: "CN", name: "China", attempts: 189, blocked: true },
  { code: "KP", name: "North Korea", attempts: 89, blocked: true },
  { code: "IR", name: "Iran", attempts: 45, blocked: false },
  { code: "BY", name: "Belarus", attempts: 23, blocked: false },
];

function getEventIcon(type: string) {
  switch (type) {
    case "blocked":
      return <Ban className="h-4 w-4 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "challenge":
      return <ShieldAlert className="h-4 w-4 text-blue-500" />;
    case "allowed":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
}

function getEventBadge(type: string) {
  switch (type) {
    case "blocked":
      return (
        <Badge variant="destructive" className="text-xs font-normal">
          Ban
        </Badge>
      );
    case "warning":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs font-normal">
          Warning
        </Badge>
      );
    case "challenge":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs font-normal">
          Challenge
        </Badge>
      );
    case "allowed":
      return (
        <Badge variant="outline" className="text-xs font-normal">
          Allowed
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

function getSeverityBadge(severity: string) {
  switch (severity) {
    case "high":
      return (
        <Badge variant="destructive" className="text-xs">
          High
        </Badge>
      );
    case "medium":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs">Medium</Badge>
      );
    case "low":
      return (
        <Badge variant="outline" className="text-xs">
          Low
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="text-xs">
          Unknown
        </Badge>
      );
  }
}

export default function AttackProtectionPage() {
  const [rules, setRules] = useState<ProtectionRule[]>(defaultProtectionRules);
  const [stats, setStats] = useState<AttackProtection>(defaultProtectionStats);
  const [blockedIPs] = useState<BlockedIp[]>(defaultBlockedIPs);
  const [attackEvents] = useState<AttackEvent[]>(defaultAttackEvents);
  const [suspiciousCountries] = useState(defaultSuspiciousCountries);
  const [isAllEnabled, setIsAllEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [protectionRes, rulesRes] = await Promise.all([
          securityDashboardApi.getAttackProtection(),
          securityDashboardApi.getBruteForce(),
        ]);

        if (protectionRes.success && protectionRes.data) {
          setStats(protectionRes.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load attack protection data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const toggleRule = async (id: string) => {
    const rule = rules.find((r) => r.id === id);
    if (!rule) return;

    const newEnabled = !rule.enabled;
    setRules(rules.map((r) => (r.id === id ? { ...r, enabled: newEnabled } : r)));

    try {
      if (id === "brute-force") {
        await securityDashboardApi.updateBruteForce({ enabled: newEnabled });
      } else {
        await securityDashboardApi.updateAttackProtection({
          activeRules: rules.filter((r) => r.enabled).length,
        });
      }
    } catch {
      setRules(rules.map((r) => (r.id === id ? { ...r, enabled: !newEnabled } : r)));
    }
  };

  const activeRulesCount = rules.filter((r) => r.enabled).length;
  const totalBan = rules.reduce((acc, r) => acc + r.blockedCount, 0);
  const threatLevelColor =
    stats.threatLevel === "high"
      ? "text-red-600"
      : stats.threatLevel === "moderate"
        ? "text-yellow-600"
        : "text-green-600";

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              <XCircle className="h-8 w-8 mx-auto mb-2" />
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Identity Attack Protection</h1>
            <p className="text-muted-foreground">
              Configure security protections against brute force, rate limiting, and suspicious
              activities.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rules">Protection Rules</TabsTrigger>
            <TabsTrigger value="blocked">Ban IPs</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Ban Today</p>
                      <p className="text-3xl font-bold tracking-tight">
                        {stats.blockedToday.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <Ban className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium">+23.5%</span>
                    </div>
                    <span className="text-muted-foreground">from yesterday</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Active Rules</p>
                      <p className="text-3xl font-bold tracking-tight">{activeRulesCount}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <ShieldCheck className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm">
                    <span className="text-muted-foreground">
                      {rules.length - activeRulesCount} rules disabled
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Suspicious IPs</p>
                      <p className="text-3xl font-bold tracking-tight">{stats.suspiciousIPs}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Server className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm">
                    <span className="text-muted-foreground">Currently monitored</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Threat Level</p>
                      <p
                        className={`text-3xl font-bold tracking-tight capitalize ${threatLevelColor}`}
                      >
                        {stats.threatLevel}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full",
                        stats.threatLevel === "high"
                          ? "bg-red-100"
                          : stats.threatLevel === "moderate"
                            ? "bg-yellow-100"
                            : "bg-green-100"
                      )}
                    >
                      <ShieldAlert
                        className={cn(
                          "h-6 w-6",
                          stats.threatLevel === "high"
                            ? "text-red-600"
                            : stats.threatLevel === "moderate"
                              ? "text-yellow-600"
                              : "text-green-600"
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Protection Status</CardTitle>
                  <CardDescription>Overview of active security protections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm">Brute Force Protection</span>
                    </div>
                    <Switch checked={true} disabled />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm">Rate Limiting</span>
                    </div>
                    <Switch checked={true} disabled />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm">IP Blocklist</span>
                    </div>
                    <Switch checked={true} disabled />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                      <span className="text-sm">Anomaly Detection</span>
                    </div>
                    <Switch checked={true} disabled />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Protection Coverage</span>
                      <span className="font-medium">
                        {Math.round(
                          (stats.normalTraffic / (stats.normalTraffic + stats.attackAttempts)) * 100
                        )}
                        % of traffic
                      </span>
                    </div>
                    <Progress
                      value={
                        (stats.normalTraffic / (stats.normalTraffic + stats.attackAttempts)) * 100
                      }
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Attack Distribution</CardTitle>
                  <CardDescription>Types of attacks blocked today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-red-500" />
                        <span className="text-sm">Brute Force</span>
                      </div>
                      <span className="font-medium">847</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Rate Limiting</span>
                      </div>
                      <span className="font-medium">423</span>
                    </div>
                    <Progress value={34} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">Geographic</span>
                      </div>
                      <span className="font-medium">89</span>
                    </div>
                    <Progress value={7} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Fingerprint className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Anomaly</span>
                      </div>
                      <span className="font-medium">34</span>
                    </div>
                    <Progress value={3} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Recent Attack Events</CardTitle>
                    <CardDescription>Latest attack attempts and security events</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/monitoring/logs" className="gap-1">
                      View all logs
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {attackEvents.map((event, index) => (
                    <div key={index} className="flex items-start gap-3 px-6 py-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted mt-0.5">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{event.source}</p>
                          {getEventBadge(event.type)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{event.method}</span>
                          <span>-</span>
                          <span>{event.target}</span>
                          <span>-</span>
                          <span>{event.country}</span>
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

          <TabsContent value="rules" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Active Protection</p>
                      <p className="text-3xl font-bold tracking-tight">{activeRulesCount}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <ShieldCheck className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Total Ban</p>
                      <p className="text-3xl font-bold tracking-tight">
                        {totalBan.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <Ban className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Threat Level</p>
                      <p className={`text-3xl font-bold tracking-tight ${threatLevelColor}`}>
                        {stats.threatLevel}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <ShieldAlert className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Protection Rules</CardTitle>
                    <CardDescription>Configure security protection mechanisms</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Enable All</span>
                    <Switch checked={isAllEnabled} onCheckedChange={setIsAllEnabled} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {rules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Shield className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{rule.name}</p>
                          <p className="text-xs text-muted-foreground">{rule.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {rule.enabled && (
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {rule.blockedCount.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">blocked</p>
                          </div>
                        )}
                        {getSeverityBadge(rule.severity)}
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={() => toggleRule(rule.id)}
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
                  <CardTitle className="text-base font-semibold">Brute Force Settings</CardTitle>
                  <CardDescription>Configure brute force attack detection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Maximum Attempts</label>
                    <Select defaultValue="5">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                        <SelectItem value="10">10 attempts</SelectItem>
                        <SelectItem value="15">15 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Lockout Duration</label>
                    <Select defaultValue="900">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">5 minutes</SelectItem>
                        <SelectItem value="900">15 minutes</SelectItem>
                        <SelectItem value="1800">30 minutes</SelectItem>
                        <SelectItem value="3600">1 hour</SelectItem>
                        <SelectItem value="86400">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reset After</label>
                    <Select defaultValue="3600">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1800">30 minutes</SelectItem>
                        <SelectItem value="3600">1 hour</SelectItem>
                        <SelectItem value="7200">2 hours</SelectItem>
                        <SelectItem value="86400">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Rate Limiting Settings</CardTitle>
                  <CardDescription>Configure API request rate limits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Requests per Minute</label>
                    <Select defaultValue="60">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 requests</SelectItem>
                        <SelectItem value="30">30 requests</SelectItem>
                        <SelectItem value="60">60 requests</SelectItem>
                        <SelectItem value="100">100 requests</SelectItem>
                        <SelectItem value="300">300 requests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">IP Whitelist</label>
                    <Input placeholder="Enter IP addresses to whitelist" />
                    <p className="text-xs text-muted-foreground">
                      Separate multiple IPs with commas
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bypass Auth</label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Allow rate limit bypass for authenticated users
                      </span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="blocked" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Currently Ban</p>
                      <p className="text-3xl font-bold tracking-tight">
                        {blockedIPs.filter((ip) => ip.status === "active").length}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <Ban className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Permanently Ban</p>
                      <p className="text-3xl font-bold tracking-tight">
                        {blockedIPs.filter((ip) => ip.status === "permanent").length}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Lock className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Released (24h)</p>
                      <p className="text-3xl font-bold tracking-tight">
                        {blockedIPs.filter((ip) => ip.status === "released").length}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <Unlock className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Ban IP Addresses</CardTitle>
                    <CardDescription>
                      Manage IP addresses blocked by security systems
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View History
                    </Button>
                    <Button variant="outline" size="sm">
                      <Ban className="h-4 w-4 mr-2" />
                      Add IP
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {blockedIPs.map((ip, index) => (
                    <div key={index} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Server className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium font-mono">{ip.ip}</p>
                          <p className="text-xs text-muted-foreground">
                            {ip.country} - {ip.reason}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{ip.attempts} attempts</p>
                          <p className="text-xs text-muted-foreground">Last: {ip.lastAttempt}</p>
                        </div>
                        <Badge
                          variant={
                            ip.status === "active"
                              ? "destructive"
                              : ip.status === "permanent"
                                ? "outline"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {ip.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Unlock className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Geographic Blocking</CardTitle>
                <CardDescription>Block or monitor traffic from specific countries</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {suspiciousCountries.map((country) => (
                    <div key={country.code} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Globe className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{country.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {country.attempts} attempts today
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={country.blocked ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {country.blocked ? "Ban" : "Monitored"}
                        </Badge>
                        <Switch checked={country.blocked} />
                      </div>
                    </div>
                  ))}
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
                      <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                      <p className="text-3xl font-bold tracking-tight">{stats.attackAttempts}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Activity className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Ban</p>
                      <p className="text-3xl font-bold tracking-tight">
                        {Math.round(stats.attackAttempts * 0.85).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <Ban className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Challenged</p>
                      <p className="text-3xl font-bold tracking-tight">
                        {Math.round(stats.attackAttempts * 0.1).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                      <ShieldAlert className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Allowed</p>
                      <p className="text-3xl font-bold tracking-tight">
                        {Math.round(stats.attackAttempts * 0.05).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">All Security Events</CardTitle>
                    <CardDescription>Complete log of security events and actions</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/monitoring/logs" className="gap-1">
                      View all logs
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {attackEvents.map((event, index) => (
                    <div key={index} className="flex items-start gap-3 px-6 py-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted mt-0.5">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate font-mono">{event.source}</p>
                          {getEventBadge(event.type)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{event.method}</span>
                          <span>-</span>
                          <span>Target: {event.target}</span>
                          <span>-</span>
                          <span>{event.country}</span>
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
