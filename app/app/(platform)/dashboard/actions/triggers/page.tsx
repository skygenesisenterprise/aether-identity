"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  Play,
  Pause,
  Plus,
  Trash2,
  Edit,
  ArrowRight,
  Clock,
  LogIn,
  UserPlus,
  LogOut,
  Key,
  Mail,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Search,
  Filter,
  Webhook,
  Timer,
  Fingerprint,
  CreditCard,
  Loader2,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { actionsApi } from "@/lib/api/client";
import type { ActionTriggerDef, ActionTriggerMapping, TriggerEvent } from "@/lib/api/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LogIn,
  UserPlus,
  LogOut,
  Key,
  Mail,
  RefreshCw,
  Fingerprint,
  CreditCard,
};

const getIcon = (name: string) => iconMap[name] || Zap;

function getCategoryColor(category: string) {
  switch (category) {
    case "Authentication":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    case "Security":
      return "bg-red-100 text-red-700 hover:bg-red-100";
    case "Tokens":
      return "bg-purple-100 text-purple-700 hover:bg-purple-100";
    case "Notifications":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function TriggersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("triggers");

  const [triggers, setTriggers] = useState<ActionTriggerDef[]>([]);
  const [mappings, setMappings] = useState<ActionTriggerMapping[]>([]);
  const [events, setEvents] = useState<TriggerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalTriggers: 0,
    enabledTriggers: 0,
    totalExecutions: 0,
    errorRate: "0%",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [triggersRes, mappingsRes, eventsRes] = await Promise.all([
          actionsApi.getTriggers(),
          actionsApi.getTriggerMappings(),
          actionsApi.getTriggerEvents(),
        ]);

        if (triggersRes.success && triggersRes.data) {
          setTriggers(triggersRes.data);
          const enabled = triggersRes.data.filter((t) => t.status === "enabled").length;
          const totalActions = triggersRes.data.reduce((sum, t) => sum + (t.actionsCount || 0), 0);
          setStats({
            totalTriggers: triggersRes.data.length,
            enabledTriggers: enabled,
            totalExecutions: totalActions * 1000,
            errorRate: "0.03%",
          });
        }

        if (mappingsRes.success && mappingsRes.data) {
          setMappings(mappingsRes.data);
        }

        if (eventsRes.success && eventsRes.data) {
          setEvents(eventsRes.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load triggers data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTriggers = triggers.filter((trigger) => {
    const matchesSearch =
      trigger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trigger.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || trigger.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleTrigger = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "enabled" ? "disabled" : "enabled";
      await actionsApi.update(id, { triggers: [newStatus] });
      setTriggers(
        triggers.map((t) =>
          t.id === id ? { ...t, status: newStatus as "enabled" | "disabled" } : t
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle trigger");
    }
  };

  const handleToggleMapping = async (trigger: string, enabled: boolean) => {
    try {
      setMappings(mappings.map((m) => (m.trigger === trigger ? { ...m, enabled } : m)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update mapping");
    }
  };

  const triggerStats = [
    {
      label: "Total Triggers",
      value: String(stats.totalTriggers),
      change: "0",
      trend: "neutral" as const,
    },
    {
      label: "Enabled Triggers",
      value: String(stats.enabledTriggers),
      change: "0",
      trend: "neutral" as const,
    },
    {
      label: "Total Executions",
      value: formatNumber(stats.totalExecutions),
      change: "+8.5%",
      trend: "up" as const,
    },
    { label: "Error Rate", value: stats.errorRate, change: "-0.01%", trend: "down" as const },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Identity Triggers</h1>
            <p className="text-muted-foreground">
              Configure event triggers that launch your Actions.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {triggerStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Zap className="h-6 w-6 text-foreground" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <div
                    className={cn(
                      "flex items-center gap-1",
                      stat.trend === "up"
                        ? "text-green-600"
                        : stat.trend === "down"
                          ? "text-red-600"
                          : "text-muted-foreground"
                    )}
                  >
                    {stat.trend !== "neutral" && (
                      <ChevronRight
                        className={cn("h-4 w-4", stat.trend === "down" && "rotate-90")}
                      />
                    )}
                    <span className="font-medium">{stat.change}</span>
                  </div>
                  <span className="text-muted-foreground">from last week</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="triggers">Available Triggers</TabsTrigger>
            <TabsTrigger value="mappings">Action Mappings</TabsTrigger>
            <TabsTrigger value="logs">Execution Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="triggers" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search triggers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Authentication">Authentication</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Tokens">Tokens</SelectItem>
                  <SelectItem value="Notifications">Notifications</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent className="p-0">
                {filteredTriggers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Zap className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm font-medium">No triggers found</p>
                    <p className="text-sm text-muted-foreground">Adjust your search or filters</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredTriggers.map((trigger) => {
                      const Icon = getIcon(trigger.name);
                      return (
                        <div
                          key={trigger.id}
                          className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <Icon className="h-5 w-5 text-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{trigger.name}</p>
                              <Badge
                                className={cn(
                                  "text-xs",
                                  trigger.status === "enabled"
                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                {trigger.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {trigger.description}
                            </p>
                          </div>
                          <Badge className={cn("text-xs", getCategoryColor(trigger.category))}>
                            {trigger.category}
                          </Badge>
                          <div className="hidden flex-col items-end gap-1 md:flex">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Webhook className="h-3 w-3" />
                              <span>{trigger.eventType}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{trigger.actionsCount} actions</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleToggleTrigger(trigger.id, trigger.status)}
                            >
                              {trigger.status === "enabled" ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mappings" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Map triggers to Actions that should execute on each event.
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Mapping
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {mappings.length === 0 ? (
                <div className="col-span-2 flex flex-col items-center justify-center py-12">
                  <Zap className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-sm font-medium">No mappings configured</p>
                  <p className="text-sm text-muted-foreground">
                    Create mappings to link triggers with actions
                  </p>
                </div>
              ) : (
                mappings.map((mapping) => (
                  <Card key={mapping.trigger}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                            <Zap className="h-4 w-4 text-foreground" />
                          </div>
                          <CardTitle className="text-base font-semibold">
                            {mapping.trigger}
                          </CardTitle>
                        </div>
                        <Switch
                          checked={mapping.enabled}
                          onCheckedChange={(checked) =>
                            handleToggleMapping(mapping.trigger, checked)
                          }
                        />
                      </div>
                      <CardDescription>
                        {mapping.actions.length} action(s) configured
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {mapping.actions.length > 0 ? (
                        <div className="space-y-2">
                          {mapping.actions.map((action) => (
                            <div
                              key={action}
                              className="flex items-center justify-between rounded-md border p-3"
                            >
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="text-sm">{action}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <AlertTriangle className="h-4 w-4" />
                          <span>No actions configured</span>
                        </div>
                      )}
                      <Button variant="outline" size="sm" className="mt-3 w-full">
                        <Plus className="mr-2 h-3 w-3" />
                        Add Action
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Recent Trigger Events</CardTitle>
                    <CardDescription>Latest trigger execution logs</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm font-medium">No events found</p>
                    <p className="text-sm text-muted-foreground">Trigger events will appear here</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {events.map((event, index) => (
                      <div key={index} className="flex items-start gap-3 px-6 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted mt-0.5">
                          {event.status === "success" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{event.trigger}</p>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <p className="text-sm font-medium">{event.action}</p>
                            <Badge
                              variant={event.status === "success" ? "outline" : "destructive"}
                              className="text-xs"
                            >
                              {event.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{event.user}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{event.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Timer className="h-3 w-3" />
                            <span>{event.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Need help with Triggers?</p>
            <p className="text-sm text-muted-foreground">
              Learn how triggers work and how to configure them.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="https://docs.aetheridentity.dev/actions/triggers" target="_blank">
              Trigger Documentation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
}
