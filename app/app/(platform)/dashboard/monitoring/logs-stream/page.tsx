"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  LogIn,
  UserPlus,
  Shield,
  RefreshCw,
  Clock,
  Zap,
  Filter,
  Loader2,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { LogEntry, LogLevel, LogEvent } from "@/lib/api/types";

const levelConfig = {
  info: { label: "Info", color: "text-blue-600", bg: "bg-blue-50", dot: "bg-blue-500" },
  success: { label: "Success", color: "text-green-600", bg: "bg-green-50", dot: "bg-green-500" },
  warning: {
    label: "Warning",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    dot: "bg-yellow-500",
  },
  error: { label: "Error", color: "text-red-600", bg: "bg-red-50", dot: "bg-red-500" },
};

const eventConfig = {
  login: { icon: LogIn, label: "Login" },
  signup: { icon: UserPlus, label: "Signup" },
  logout: { icon: LogIn, label: "Logout" },
  mfa: { icon: Shield, label: "MFA" },
  password_reset: { icon: RefreshCw, label: "Password Reset" },
  api_call: { icon: CheckCircle2, label: "API Call" },
};

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function LogsStreamPage() {
  const [isStreaming, setIsStreaming] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [maxLogs, setMaxLogs] = useState(100);
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<InstanceType<typeof EventSource> | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isStreaming) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setConnected(false);
      return;
    }

    const connectSSE = () => {
      setError(null);
      const params = new URLSearchParams();
      if (levelFilter !== "all") params.set("level", levelFilter);
      if (eventFilter !== "all") params.set("event", eventFilter);

      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const url = `${baseUrl}/api/v1/logs/stream?${params.toString()}`;

      const eventSource = new EventSource(url);

      eventSource.onopen = () => {
        setConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const newLog: LogEntry = {
            id: data.id || `log-${Date.now()}`,
            timestamp: data.timestamp || new Date().toISOString(),
            level: data.level || "info",
            event: data.event || "api_call",
            user: data.user || "unknown",
            email: data.email || "",
            ip: data.ip || "0.0.0.0",
            connection: data.connection || "Unknown",
            details: data.details || "Event received",
            ...data,
          };
          setLogs((prev) => {
            const updated = [...prev, newLog];
            if (updated.length > maxLogs) {
              return updated.slice(-maxLogs);
            }
            return updated;
          });
        } catch (err) {
          console.error("Failed to parse log:", err);
        }
      };

      eventSource.onerror = () => {
        setConnected(false);
        setError("Connection lost. Reconnecting...");
        eventSource.close();
        setTimeout(() => {
          if (isStreaming) {
            connectSSE();
          }
        }, 3000);
      };
    };

    connectSSE();
    eventSourceRef.current = eventSourceRef.current;

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setConnected(false);
    };
  }, [isStreaming, levelFilter, eventFilter, maxLogs]);

  useEffect(() => {
    if (logsEndRef.current && isStreaming && connected) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isStreaming, connected]);

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    const matchesEvent = eventFilter === "all" || log.event === eventFilter;
    return matchesLevel && matchesEvent;
  });

  const logStats = {
    total: logs.length,
    success: logs.filter((l) => l.level === "success").length,
    errors: logs.filter((l) => l.level === "error").length,
    warnings: logs.filter((l) => l.level === "warning").length,
  };

  const errorRate =
    logStats.total > 0 ? ((logStats.errors / logStats.total) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Identity Live Logs</h1>
            <p className="text-muted-foreground">
              Real-time authentication events and activity stream.
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
                  <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                  <p className="text-3xl font-bold tracking-tight">{logStats.total}</p>
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

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                  <p className="text-3xl font-bold tracking-tight">{errorRate}%</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Zap className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-base font-semibold">Live Stream</CardTitle>
                <div className="flex items-center gap-2">
                  {isStreaming && connected ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <span className="relative flex h-2 w-2 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Connected
                    </Badge>
                  ) : isStreaming ? (
                    <Badge variant="secondary">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Connecting...
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Paused</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={maxLogs.toString()} onValueChange={(v) => setMaxLogs(Number(v))}>
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 logs</SelectItem>
                    <SelectItem value="100">100 logs</SelectItem>
                    <SelectItem value="200">200 logs</SelectItem>
                    <SelectItem value="500">500 logs</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant={isStreaming ? "secondary" : "default"}
                  size="sm"
                  onClick={() => setIsStreaming(!isStreaming)}
                  className="gap-2"
                >
                  {isStreaming ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Resume
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setLogs([])} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
            <CardDescription>
              Real-time authentication events. Auto-scrolls when streaming is active.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
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

            {error && (
              <div className="mb-4 p-4 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>
            )}

            <div className="rounded-md border bg-muted/20 max-h-125 overflow-y-auto">
              {filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Filter className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-sm">No logs to display</p>
                  <p className="text-xs">Waiting for new events...</p>
                </div>
              ) : (
                <div className="divide-y">
                  <div ref={logsEndRef} />
                  {[...filteredLogs].reverse().map((log, index) => (
                    <div
                      key={log.id}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50",
                        index === 0 && isStreaming && connected && "bg-muted/30"
                      )}
                    >
                      <div className="flex items-center gap-3 w-24 shrink-0">
                        <div className={cn("h-2 w-2 rounded-full", levelConfig[log.level]?.dot)} />
                        <span className="text-xs font-mono text-muted-foreground">
                          {formatTime(log.timestamp)}
                        </span>
                      </div>
                      <div className="w-20 shrink-0">
                        <Badge
                          className={cn(
                            "text-xs font-normal",
                            levelConfig[log.level]?.bg,
                            levelConfig[log.level]?.color
                          )}
                        >
                          {levelConfig[log.level]?.label || log.level}
                        </Badge>
                      </div>
                      <div className="w-24 shrink-0">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const Icon = eventConfig[log.event]?.icon || LogIn;
                            return <Icon className="h-4 w-4 text-muted-foreground" />;
                          })()}
                          <span className="text-sm">
                            {eventConfig[log.event]?.label || log.event}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium truncate">{log.user}</span>
                          <span className="text-xs text-muted-foreground truncate">
                            {log.email}
                          </span>
                        </div>
                      </div>
                      <div className="w-32 shrink-0 text-sm text-muted-foreground">
                        {log.connection}
                      </div>
                      <div className="w-28 shrink-0">
                        <span className="text-sm font-mono text-muted-foreground">{log.ip}</span>
                      </div>
                      <div className="w-48 shrink-0">
                        <span className="text-sm text-muted-foreground truncate">
                          {log.details}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredLogs.length} of {logs.length} events
                {levelFilter !== "all" || eventFilter !== "all" ? " (filtered)" : ""}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLevelFilter("all");
                    setEventFilter("all");
                  }}
                  disabled={levelFilter === "all" && eventFilter === "all"}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Events Distribution</CardTitle>
              <CardDescription>Breakdown of event types in the stream</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(eventConfig).map(([key, config]) => {
                  const count = logs.filter((l) => l.event === key).length;
                  const percentage = logStats.total > 0 ? (count / logStats.total) * 100 : 0;
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
              <CardTitle className="text-base font-semibold">Level Distribution</CardTitle>
              <CardDescription>Breakdown of log severity levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(levelConfig).map(([key, config]) => {
                  const count = logs.filter((l) => l.level === key).length;
                  const percentage = logStats.total > 0 ? (count / logStats.total) * 100 : 0;
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-3 w-3 rounded-full", config.dot)} />
                        <span className="text-sm">{config.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn("h-full", config.dot)}
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
