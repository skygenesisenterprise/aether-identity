"use client";

import * as React from "react";
import { useState } from "react";
import {
  Search,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  Zap,
  Play,
  XCircle,
  Code,
  Lock,
  UserCheck,
  Database,
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
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type ActionStatus = "success" | "failed" | "running" | "timeout";
type ActionTrigger =
  | "login"
  | "pre-user-registration"
  | "post-user-registration"
  | "pre-login"
  | "post-login"
  | "password-change"
  | "token-exchange"
  | "custom-actor";

interface ActionLogEntry {
  id: string;
  timestamp: Date;
  status: ActionStatus;
  trigger: ActionTrigger;
  actionName: string;
  actionId: string;
  user: string;
  email: string;
  ip: string;
  duration: number;
  result?: string;
  error?: string;
  version: string;
}

const generateMockActionLogs = (): ActionLogEntry[] => {
  const triggers: ActionTrigger[] = [
    "login",
    "pre-user-registration",
    "post-user-registration",
    "pre-login",
    "post-login",
    "password-change",
    "token-exchange",
    "custom-actor",
  ];
  const statuses: ActionStatus[] = ["success", "failed", "running", "timeout"];
  const users = [
    { name: "john.doe", email: "john.doe@example.com" },
    { name: "jane.smith", email: "jane.smith@company.co" },
    { name: "admin", email: "admin@etheriatimes.com" },
    { name: "secure.user", email: "secure@company.org" },
    { name: "api_client", email: "api-client@service.com" },
  ];
  const ips = ["192.168.1.45", "10.0.0.123", "203.45.67.89", "172.16.0.55", "192.168.2.100"];

  const actions = [
    { name: "Add Custom Claims", id: "act_abc123" },
    { name: "Set Session Timeout", id: "act_def456" },
    { name: "Enforce MFA", id: "act_ghi789" },
    { name: "Log Authentication", id: "act_jkl012" },
    { name: "Transform User Metadata", id: "act_mno345" },
    { name: "Rate Limit Check", id: "act_pqr678" },
    { name: "Validate Email Domain", id: "act_stu901" },
  ];

  const logs: ActionLogEntry[] = [];
  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const trigger = triggers[Math.floor(Math.random() * triggers.length)];
    const status =
      Math.random() > 0.15 ? "success" : statuses[Math.floor(Math.random() * statuses.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const minutesAgo = Math.floor(Math.random() * 1440);

    logs.push({
      id: `action-${i + 1}`,
      timestamp: new Date(Date.now() - minutesAgo * 60 * 1000),
      status,
      trigger,
      actionName: action.name,
      actionId: action.id,
      user: user.name,
      email: user.email,
      ip: ips[Math.floor(Math.random() * ips.length)],
      duration: Math.floor(Math.random() * 500) + 10,
      result: status === "success" ? "Action executed successfully" : undefined,
      error:
        status === "failed"
          ? "Action execution failed: Invalid configuration"
          : status === "timeout"
            ? "Action timed out after 30s"
            : undefined,
      version: `v${Math.floor(Math.random() * 3) + 1}.0.0`,
    });
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const actionLogEntries = generateMockActionLogs();

const statusConfig = {
  success: {
    label: "Success",
    color: "bg-green-500",
    text: "text-green-600",
    bg: "bg-green-50",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    color: "bg-red-500",
    text: "text-red-600",
    bg: "bg-red-50",
    icon: XCircle,
  },
  running: {
    label: "Running",
    color: "bg-blue-500",
    text: "text-blue-600",
    bg: "bg-blue-50",
    icon: Play,
  },
  timeout: {
    label: "Timeout",
    color: "bg-yellow-500",
    text: "text-yellow-600",
    bg: "bg-yellow-50",
    icon: AlertCircle,
  },
};

const triggerConfig = {
  login: { label: "Login", icon: Lock, color: "text-blue-500" },
  "pre-user-registration": { label: "Pre-Registration", icon: UserCheck, color: "text-purple-500" },
  "post-user-registration": {
    label: "Post-Registration",
    icon: UserCheck,
    color: "text-purple-600",
  },
  "pre-login": { label: "Pre-Login", icon: Lock, color: "text-indigo-500" },
  "post-login": { label: "Post-Login", icon: Lock, color: "text-indigo-600" },
  "password-change": { label: "Password Change", icon: Database, color: "text-orange-500" },
  "token-exchange": { label: "Token Exchange", icon: Zap, color: "text-cyan-500" },
  "custom-actor": { label: "Custom Actor", icon: Code, color: "text-gray-500" },
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

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export default function ActionLogsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [triggerFilter, setTriggerFilter] = useState<string>("all");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const logsPerPage = 15;

  const filteredLogs = actionLogEntries.filter((log) => {
    const matchesSearch =
      search === "" ||
      log.email.toLowerCase().includes(search.toLowerCase()) ||
      log.ip.includes(search) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.actionName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    const matchesTrigger = triggerFilter === "all" || log.trigger === triggerFilter;
    return matchesSearch && matchesStatus && matchesTrigger;
  });

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  );

  const logStats = {
    total: actionLogEntries.length,
    success: actionLogEntries.filter((l) => l.status === "success").length,
    failed: actionLogEntries.filter((l) => l.status === "failed").length,
    running: actionLogEntries.filter((l) => l.status === "running").length,
    avgDuration: Math.round(
      actionLogEntries.reduce((acc, l) => acc + l.duration, 0) / actionLogEntries.length
    ),
    successRate: Math.round(
      (actionLogEntries.filter((l) => l.status === "success").length / actionLogEntries.length) *
        100
    ),
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Identity Action Logs</h1>
            <p className="text-muted-foreground">
              Monitor and analyze Actions execution logs and performance.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Executions</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {logStats.total.toLocaleString()}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Zap className="h-6 w-6 text-foreground" />
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
              <div className="mt-2">
                <p className="text-xs text-muted-foreground">
                  {logStats.successRate}% success rate
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Failed</p>
                  <p className="text-3xl font-bold tracking-tight text-red-600">
                    {logStats.failed}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Running</p>
                  <p className="text-3xl font-bold tracking-tight text-blue-600">
                    {logStats.running}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <Play className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {formatDuration(logStats.avgDuration)}
                  </p>
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
                <CardTitle className="text-base font-semibold">Action Executions</CardTitle>
                <CardDescription>Detailed log of Actions trigger executions</CardDescription>
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
                    placeholder="Search by user, action, or IP..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="timeout">Timeout</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={triggerFilter} onValueChange={setTriggerFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Triggers</SelectItem>
                      <SelectItem value="login">Login</SelectItem>
                      <SelectItem value="pre-user-registration">Pre-Registration</SelectItem>
                      <SelectItem value="post-user-registration">Post-Registration</SelectItem>
                      <SelectItem value="pre-login">Pre-Login</SelectItem>
                      <SelectItem value="post-login">Post-Login</SelectItem>
                      <SelectItem value="password-change">Password Change</SelectItem>
                      <SelectItem value="token-exchange">Token Exchange</SelectItem>
                      <SelectItem value="custom-actor">Custom Actor</SelectItem>
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
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-28">Trigger</TableHead>
                    <TableHead className="w-48">Action</TableHead>
                    <TableHead className="w-40">User</TableHead>
                    <TableHead className="w-28">Duration</TableHead>
                    <TableHead className="w-24">IP</TableHead>
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
                              statusConfig[log.status].bg,
                              statusConfig[log.status].text
                            )}
                          >
                            {statusConfig[log.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const Icon = triggerConfig[log.trigger].icon;
                              return (
                                <Icon className={cn("h-4 w-4", triggerConfig[log.trigger].color)} />
                              );
                            })()}
                            <span className="text-sm">{triggerConfig[log.trigger].label}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{log.actionName}</span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {log.actionId}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{log.user}</span>
                            <span className="text-xs text-muted-foreground">{log.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "text-sm font-mono",
                              log.duration > 300
                                ? "text-yellow-600"
                                : log.duration > 500
                                  ? "text-red-600"
                                  : "text-muted-foreground"
                            )}
                          >
                            {formatDuration(log.duration)}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm font-mono text-muted-foreground">
                          {log.ip}
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
                                  <h4 className="text-sm font-semibold">Action Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Action ID:</span>
                                      <span className="font-mono text-xs">{log.actionId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Version:</span>
                                      <span className="font-mono text-xs">{log.version}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Trigger:</span>
                                      <span>{triggerConfig[log.trigger].label}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Duration:</span>
                                      <span className="font-mono">
                                        {formatDuration(log.duration)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold">Result</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Status:</span>
                                      <Badge
                                        className={cn(
                                          "text-xs font-normal",
                                          statusConfig[log.status].bg,
                                          statusConfig[log.status].text
                                        )}
                                      >
                                        {statusConfig[log.status].label}
                                      </Badge>
                                    </div>
                                    {log.result && (
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Result:</span>
                                        <span>{log.result}</span>
                                      </div>
                                    )}
                                    {log.error && (
                                      <div className="flex flex-col items-end gap-1">
                                        <span className="text-muted-foreground">Error:</span>
                                        <span className="text-xs text-red-600 text-right max-w-48">
                                          {log.error}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">Action Log</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {log.timestamp.toISOString()} {log.status.toUpperCase()}{" "}
                                    {log.trigger}: {log.actionName} ({formatDuration(log.duration)})
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
              <CardTitle className="text-base font-semibold">Executions by Trigger</CardTitle>
              <CardDescription>Distribution of Action trigger types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(triggerConfig).map(([key, config]) => {
                  const count = actionLogEntries.filter((l) => l.trigger === key).length;
                  const percentage = (count / actionLogEntries.length) * 100;
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          <config.icon className={cn("h-4 w-4", config.color)} />
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
              <CardTitle className="text-base font-semibold">Execution Status</CardTitle>
              <CardDescription>Success and failure distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="font-medium">{logStats.successRate}%</span>
                </div>
                <Progress value={logStats.successRate} className="h-3" />
              </div>
              <div className="space-y-4">
                {Object.entries(statusConfig).map(([key, config]) => {
                  const count = actionLogEntries.filter((l) => l.status === key).length;
                  const percentage = (count / actionLogEntries.length) * 100;
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
