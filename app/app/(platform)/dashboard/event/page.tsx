"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  RefreshCw,
  LogIn,
  UserPlus,
  AlertCircle,
  Shield,
  Key,
  Globe,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { eventsApi } from "@/lib/api/client";
import type { EventLog, EventStats, ActivityData } from "@/lib/api/types";

const eventTypeData = [
  { time: "00:00", logins: 120, signups: 8, failures: 3 },
  { time: "04:00", logins: 85, signups: 4, failures: 2 },
  { time: "08:00", logins: 450, signups: 25, failures: 12 },
  { time: "12:00", logins: 680, signups: 42, failures: 18 },
  { time: "16:00", logins: 590, signups: 35, failures: 8 },
  { time: "20:00", logins: 320, signups: 18, failures: 5 },
];

const events = [
  {
    id: "evt_1",
    type: "success_login",
    description: "Successful login",
    user: "john.doe@example.com",
    connection: "Username-Password",
    timestamp: "2024-01-15T14:32:00Z",
    ip: "192.168.1.45",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    status: "success",
  },
  {
    id: "evt_2",
    type: "success_signup",
    description: "New user signup",
    user: "jane.smith@company.co",
    connection: "Google OAuth",
    timestamp: "2024-01-15T14:28:00Z",
    ip: "10.0.0.123",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)",
    status: "success",
  },
  {
    id: "evt_3",
    type: "failed_login",
    description: "Failed login attempt",
    user: "unknown@test.com",
    connection: "Username-Password",
    timestamp: "2024-01-15T14:25:00Z",
    ip: "203.45.67.89",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    status: "failed",
  },
  {
    id: "evt_4",
    type: "mfa_challenge",
    description: "MFA challenge completed",
    user: "secure@company.org",
    connection: "Username-Password",
    timestamp: "2024-01-15T14:20:00Z",
    ip: "192.168.2.100",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    status: "success",
  },
  {
    id: "evt_5",
    type: "token_refresh",
    description: "Access token refreshed",
    user: "admin@etheriatimes.com",
    connection: "SAML Enterprise",
    timestamp: "2024-01-15T14:18:00Z",
    ip: "172.16.0.55",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    status: "success",
  },
  {
    id: "evt_6",
    type: "password_reset",
    description: "Password reset requested",
    user: "reset@example.com",
    connection: "Username-Password",
    timestamp: "2024-01-15T14:15:00Z",
    ip: "45.67.89.10",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
    status: "warning",
  },
  {
    id: "evt_7",
    type: "failed_login",
    description: "Too many failed attempts",
    user: "attacker@bad.com",
    connection: "Username-Password",
    timestamp: "2024-01-15T14:12:00Z",
    ip: "203.45.67.100",
    userAgent: "curl/7.68.0",
    status: "failed",
  },
  {
    id: "evt_8",
    type: "success_login",
    description: "Successful login",
    user: "developer@tech.co",
    connection: "GitHub OAuth",
    timestamp: "2024-01-15T14:10:00Z",
    ip: "10.20.30.40",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    status: "success",
  },
];

const eventStats = {
  totalEvents: 12847,
  logins: 8432,
  signups: 342,
  failures: 48,
  mfaChallenges: 1247,
};

const chartConfig = {
  logins: { label: "Logins", color: "oklch(0.18 0 0)" },
  signups: { label: "Signups", color: "oklch(0.55 0.15 145)" },
  failures: { label: "Failures", color: "oklch(0.55 0.2 25)" },
};

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getEventIcon(type: string) {
  switch (type) {
    case "success_login":
      return <LogIn className="h-4 w-4" />;
    case "success_signup":
      return <UserPlus className="h-4 w-4" />;
    case "failed_login":
      return <AlertCircle className="h-4 w-4" />;
    case "mfa_challenge":
      return <Shield className="h-4 w-4" />;
    case "token_refresh":
      return <RefreshCw className="h-4 w-4" />;
    case "password_reset":
      return <Key className="h-4 w-4" />;
    default:
      return <Globe className="h-4 w-4" />;
  }
}

function getEventStatusBadge(status: string) {
  switch (status) {
    case "success":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">Success</Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive" className="text-xs">
          Failed
        </Badge>
      );
    case "warning":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs">Warning</Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="text-xs">
          Unknown
        </Badge>
      );
  }
}

function getEventTypeLabel(type: string) {
  switch (type) {
    case "success_login":
      return "Login";
    case "success_signup":
      return "Signup";
    case "failed_login":
      return "Failed Login";
    case "mfa_challenge":
      return "MFA";
    case "token_refresh":
      return "Token Refresh";
    case "password_reset":
      return "Password Reset";
    default:
      return type;
  }
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [eventType, setEventType] = useState("all");
  const [connection, setConnection] = useState("all");
  const [events, setEvents] = useState<EventLog[]>([]);
  const [eventStats, setEventStats] = useState<EventStats>({
    totalEvents: 0,
    logins: 0,
    signups: 0,
    failures: 0,
    mfaChallenges: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [eventsRes, statsRes] = await Promise.all([
          eventsApi.list({ limit: "50" }),
          eventsApi.getStats(),
        ]);

        if (eventsRes.success && eventsRes.data) {
          setEvents(eventsRes.data);
        }
        if (statsRes.success && statsRes.data) {
          setEventStats(statsRes.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = eventType === "all" || event.type === eventType;
    const matchesConnection = connection === "all" || event.connection === connection;
    return matchesSearch && matchesType && matchesConnection;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="border-b bg-background">
          <div className="px-6 py-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight">Identity Event Logs</h1>
              <p className="text-muted-foreground">
                Monitor authentication events and troubleshoot issues.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="border-b bg-background">
          <div className="px-6 py-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight">Identity Event Logs</h1>
              <p className="text-muted-foreground">
                Monitor authentication events and troubleshoot issues.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center p-12">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Identity Event Logs</h1>
            <p className="text-muted-foreground">
              Monitor authentication events and troubleshoot issues.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {eventStats.totalEvents.toLocaleString()}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Globe className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Logins</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {eventStats.logins.toLocaleString()}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <LogIn className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Signups</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {eventStats.signups.toLocaleString()}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <UserPlus className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Failed Attempts</p>
                  <p className="text-3xl font-bold tracking-tight">{eventStats.failures}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">MFA Challenges</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {eventStats.mfaChallenges.toLocaleString()}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Event Activity</CardTitle>
                <CardDescription>Events over time</CardDescription>
              </div>
              <Select defaultValue="24h">
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last hour</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-foreground" />
                <span className="text-sm text-muted-foreground">Logins</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Signups</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm text-muted-foreground">Failures</span>
              </div>
            </div>
            <ChartContainer config={chartConfig} className="h-48 w-full">
              <AreaChart data={eventTypeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillLogins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-logins)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--color-logins)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="logins"
                  stroke="var(--color-logins)"
                  strokeWidth={2}
                  fill="url(#fillLogins)"
                />
                <Area
                  type="monotone"
                  dataKey="signups"
                  stroke="var(--color-signups)"
                  strokeWidth={2}
                  fill="transparent"
                />
                <Area
                  type="monotone"
                  dataKey="failures"
                  stroke="var(--color-failures)"
                  strokeWidth={2}
                  fill="transparent"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Event History</CardTitle>
                <CardDescription>Latest authentication events</CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="success_login">Login</SelectItem>
                    <SelectItem value="success_signup">Signup</SelectItem>
                    <SelectItem value="failed_login">Failed Login</SelectItem>
                    <SelectItem value="mfa_challenge">MFA</SelectItem>
                    <SelectItem value="token_refresh">Token Refresh</SelectItem>
                    <SelectItem value="password_reset">Password Reset</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={connection} onValueChange={setConnection}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Connection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All connections</SelectItem>
                    <SelectItem value="username-password">Username-Password</SelectItem>
                    <SelectItem value="google">Google OAuth</SelectItem>
                    <SelectItem value="github">GitHub OAuth</SelectItem>
                    <SelectItem value="saml">SAML Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Connection
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            {getEventIcon(event.type)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{event.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {getEventTypeLabel(event.type)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">{event.user}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-muted-foreground">{event.connection}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-mono text-muted-foreground">{event.ip}</p>
                      </td>
                      <td className="px-4 py-3">{getEventStatusBadge(event.status)}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-muted-foreground">
                          {formatTimestamp(event.timestamp)}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Separator />
            <div className="flex items-center justify-between px-4 py-4">
              <p className="text-sm text-muted-foreground">
                Showing 8 of {events.length.toLocaleString()} events
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="group cursor-pointer transition-all hover:shadow-md">
            <Link href="/dashboard/monitoring/logs">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Globe className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Log Stream</p>
                  <p className="text-sm text-muted-foreground">Real-time log streaming</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Link>
          </Card>

          <Card className="group cursor-pointer transition-all hover:shadow-md">
            <Link href="/dashboard/monitoring/alerts">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <AlertCircle className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Alert Configuration</p>
                  <p className="text-sm text-muted-foreground">Set up event-based alerts</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Link>
          </Card>

          <Card className="group cursor-pointer transition-all hover:shadow-md">
            <Link href="/dashboard/settings/audit">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Shield className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Audit Logs</p>
                  <p className="text-sm text-muted-foreground">Compliance and audit trail</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
