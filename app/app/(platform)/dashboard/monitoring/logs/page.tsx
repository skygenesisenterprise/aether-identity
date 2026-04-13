"use client";

import * as React from "react";
import { useState } from "react";
import {
  Search,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  LogIn,
  UserPlus,
  Shield,
  Clock,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type LogLevel = "info" | "success" | "warning" | "error";
type LogEvent = "login" | "signup" | "logout" | "mfa" | "password_reset" | "api_call";

interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  event: LogEvent;
  user: string;
  email: string;
  ip: string;
  userAgent: string;
  connection: string;
  details: string;
  metadata?: Record<string, string>;
}

const generateMockLogs = (): LogEntry[] => {
  const events: LogEvent[] = ["login", "signup", "logout", "mfa", "password_reset", "api_call"];
  const levels: LogLevel[] = ["info", "success", "warning", "error"];
  const users = [
    { name: "john.doe", email: "john.doe@example.com" },
    { name: "jane.smith", email: "jane.smith@company.co" },
    { name: "admin", email: "admin@etheriatimes.com" },
    { name: "secure.user", email: "secure@company.org" },
    { name: "api_client", email: "api-client@service.com" },
  ];
  const connections = ["Username-Password", "Google OAuth", "GitHub", "SAML Enterprise", "API Key"];
  const ips = ["192.168.1.45", "10.0.0.123", "203.45.67.89", "172.16.0.55", "192.168.2.100"];
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Firefox/121.0",
  ];

  const logs: LogEntry[] = [];
  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const event = events[Math.floor(Math.random() * events.length)];
    const level =
      event === "login" && Math.random() > 0.8
        ? "error"
        : levels[Math.floor(Math.random() * levels.length)];
    const minutesAgo = Math.floor(Math.random() * 1440);

    logs.push({
      id: `log-${i + 1}`,
      timestamp: new Date(Date.now() - minutesAgo * 60 * 1000),
      level,
      event,
      user: user.name,
      email: user.email,
      ip: ips[Math.floor(Math.random() * ips.length)],
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
      connection: connections[Math.floor(Math.random() * connections.length)],
      details: getEventDetails(event, level),
      metadata: {
        sessionId: `sess-${Math.random().toString(36).substr(2, 9)}`,
        requestId: `req-${Math.random().toString(36).substr(2, 9)}`,
      },
    });
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

function getEventDetails(event: LogEvent, level: LogLevel): string {
  switch (event) {
    case "login":
      return level === "error" ? "Invalid credentials" : "Successfully authenticated";
    case "signup":
      return "New user account created";
    case "logout":
      return "User logged out";
    case "mfa":
      return "MFA challenge completed successfully";
    case "password_reset":
      return "Password reset email sent";
    case "api_call":
      return "API request authenticated";
    default:
      return "Event processed";
  }
}

const logEntries = generateMockLogs();

const levelConfig = {
  info: { label: "Info", color: "bg-blue-500", text: "text-blue-600", bg: "bg-blue-50" },
  success: { label: "Success", color: "bg-green-500", text: "text-green-600", bg: "bg-green-50" },
  warning: {
    label: "Warning",
    color: "bg-yellow-500",
    text: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  error: { label: "Error", color: "bg-red-500", text: "text-red-600", bg: "bg-red-50" },
};

const eventConfig = {
  login: { icon: LogIn, label: "Login" },
  signup: { icon: UserPlus, label: "Signup" },
  logout: { icon: LogIn, label: "Logout" },
  mfa: { icon: Shield, label: "MFA" },
  password_reset: { icon: RefreshCw, label: "Password Reset" },
  api_call: { icon: CheckCircle2, label: "API Call" },
};

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hours ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const logsPerPage = 15;

  const filteredLogs = logEntries.filter((log) => {
    const matchesSearch =
      search === "" ||
      log.email.toLowerCase().includes(search.toLowerCase()) ||
      log.ip.includes(search) ||
      log.user.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    const matchesEvent = eventFilter === "all" || log.event === eventFilter;
    return matchesSearch && matchesLevel && matchesEvent;
  });

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  );

  const logStats = {
    total: logEntries.length,
    success: logEntries.filter((l) => l.level === "success" || l.event === "login").length,
    errors: logEntries.filter((l) => l.level === "error").length,
    warnings: logEntries.filter((l) => l.level === "warning").length,
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Identity Logs</h1>
            <p className="text-muted-foreground">
              View and analyze authentication logs and events.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {logStats.total.toLocaleString()}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Clock className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Successful</p>
                  <p className="text-3xl font-bold tracking-tight text-green-600">
                    {logStats.success}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Errors</p>
                  <p className="text-3xl font-bold tracking-tight text-red-600">
                    {logStats.errors}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                  <p className="text-3xl font-bold tracking-tight text-yellow-600">
                    {logStats.warnings}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-50">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Log Entries</CardTitle>
                <CardDescription>Authentication events and activities</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by email, IP, or user..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="login">Login</SelectItem>
                      <SelectItem value="signup">Signup</SelectItem>
                      <SelectItem value="logout">Logout</SelectItem>
                      <SelectItem value="mfa">MFA</SelectItem>
                      <SelectItem value="password_reset">Password Reset</SelectItem>
                      <SelectItem value="api_call">API Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="w-32">Timestamp</TableHead>
                    <TableHead className="w-24">Level</TableHead>
                    <TableHead className="w-24">Event</TableHead>
                    <TableHead className="w-48">User</TableHead>
                    <TableHead className="w-32">Connection</TableHead>
                    <TableHead className="w-32">IP Address</TableHead>
                    <TableHead className="w-48">Details</TableHead>
                    <TableHead className="w-16">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.map((log) => (
                    <React.Fragment key={log.id}>
                      <TableRow
                        className="cursor-pointer"
                        onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                      >
                        <TableCell>
                          {expandedLog === log.id ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "text-xs font-normal",
                              levelConfig[log.level].bg,
                              levelConfig[log.level].text
                            )}
                          >
                            {levelConfig[log.level].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const Icon = eventConfig[log.event].icon;
                              return <Icon className="h-4 w-4 text-muted-foreground" />;
                            })()}
                            <span className="text-sm">{eventConfig[log.event].label}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{log.user}</span>
                            <span className="text-xs text-muted-foreground">{log.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{log.connection}</TableCell>
                        <TableCell className="text-sm font-mono text-muted-foreground">
                          {log.ip}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {log.details}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedLog === log.id && (
                        <TableRow>
                          <TableCell colSpan={9} className="bg-muted/30">
                            <div className="p-4 space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold">Request Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Session ID:</span>
                                      <span className="font-mono text-xs">
                                        {log.metadata?.sessionId}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Request ID:</span>
                                      <span className="font-mono text-xs">
                                        {log.metadata?.requestId}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">User Agent:</span>
                                      <span className="font-mono text-xs truncate max-w-50">
                                        {log.userAgent}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold">Security Context</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Authentication Method:
                                      </span>
                                      <span>{log.connection}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">IP Address:</span>
                                      <span className="font-mono">{log.ip}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Timestamp:</span>
                                      <span>{log.timestamp.toISOString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">Raw Log</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {log.timestamp.toISOString()} {log.level.toUpperCase()}{" "}
                                    {log.event}: {log.details}
                                  </span>
                                </div>
                                <Button variant="outline" size="sm" className="gap-2">
                                  <Copy className="h-3 w-3" />
                                  Copy JSON
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * logsPerPage + 1} to{" "}
                {Math.min(currentPage * logsPerPage, filteredLogs.length)} of {filteredLogs.length}{" "}
                entries
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Events by Type</CardTitle>
              <CardDescription>Distribution of log event types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(eventConfig).map(([key, config]) => {
                  const count = logEntries.filter((l) => l.event === key).length;
                  const percentage = (count / logEntries.length) * 100;
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          <config.icon className="h-4 w-4 text-foreground" />
                        </div>
                        <span className="text-sm">{config.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-foreground"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono text-muted-foreground w-8">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Log Levels</CardTitle>
              <CardDescription>Distribution of log severity levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(levelConfig).map(([key, config]) => {
                  const count = logEntries.filter((l) => l.level === key).length;
                  const percentage = (count / logEntries.length) * 100;
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-3 w-3 rounded-full", config.color)} />
                        <span className="text-sm">{config.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn("h-full", config.color)}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono text-muted-foreground w-8">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
