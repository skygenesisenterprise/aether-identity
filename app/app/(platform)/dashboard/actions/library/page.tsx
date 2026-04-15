"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  Plus,
  Play,
  Pause,
  Trash2,
  Copy,
  Edit,
  ArrowRight,
  Clock,
  Users,
  LogIn,
  Shield,
  UserPlus,
  Mail,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Search,
  Filter,
  Loader2,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import type { Action, ActionTemplate, DashboardActionLogEntry } from "@/lib/api/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LogIn,
  UserPlus,
  Shield,
  Mail,
  Users,
};

const getIcon = (name: string) => iconMap[name] || Zap;

export default function ActionsLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("deployed");

  const [actions, setActions] = useState<Action[]>([]);
  const [templates, setTemplates] = useState<ActionTemplate[]>([]);
  const [actionLogs, setActionLogs] = useState<DashboardActionLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalActions: 0,
    activeActions: 0,
    totalExecutions: 0,
    errorRate: "0%",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [actionsRes, templatesRes, triggersRes] = await Promise.all([
          actionsApi.list(),
          actionsApi.getLibrary(),
          actionsApi.getTriggerEvents(),
        ]);

        if (actionsRes.success && actionsRes.data) {
          setActions(actionsRes.data);
          const active = actionsRes.data.filter((a) => a.status === "active").length;
          const totalRuns = actionsRes.data.reduce((sum, a) => sum + (a.runs || 0), 0);
          const totalErrors = actionsRes.data.reduce((sum, a) => sum + (a.errors || 0), 0);
          const errorRate = totalRuns > 0 ? ((totalErrors / totalRuns) * 100).toFixed(2) : "0";
          setStats({
            totalActions: actionsRes.data.length,
            activeActions: active,
            totalExecutions: totalRuns,
            errorRate: `${errorRate}%`,
          });
        }

        if (templatesRes.success && templatesRes.data) {
          setTemplates(templatesRes.data);
        }

        if (triggersRes.success && triggersRes.data) {
          setActionLogs(triggersRes.data as unknown as DashboardActionLogEntry[]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load actions data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredActions = actions.filter((action) => {
    const matchesSearch =
      action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "active" && action.status === "active") ||
      (selectedCategory === "disabled" && action.status === "disabled");
    return matchesSearch && matchesCategory;
  });

  const handleToggleAction = async (id: string, currentStatus: string) => {
    try {
      if (currentStatus === "active") {
        await actionsApi.update(id, { triggers: [] });
      } else {
        await actionsApi.deploy(id);
      }
      const res = await actionsApi.list();
      if (res.success && res.data) {
        setActions(res.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update action");
    }
  };

  const handleDeleteAction = async (id: string) => {
    try {
      await actionsApi.delete(id);
      setActions(actions.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete action");
    }
  };

  const handleTestAction = async (id: string) => {
    try {
      await actionsApi.test(id);
      alert("Action test executed successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to test action");
    }
  };

  const actionStats = [
    {
      label: "Total Actions",
      value: String(stats.totalActions),
      change: "+3",
      trend: "up" as const,
    },
    {
      label: "Active Actions",
      value: String(stats.activeActions),
      change: "+1",
      trend: "up" as const,
    },
    {
      label: "Total Executions",
      value: formatNumber(stats.totalExecutions),
      change: "+12.3%",
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
            <h1 className="text-2xl font-semibold tracking-tight">Identity Actions Library</h1>
            <p className="text-muted-foreground">
              Create and manage custom authentication logic with Actions.
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
          {actionStats.map((stat) => (
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
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    )}
                  >
                    <ChevronRight className={cn("h-4 w-4", stat.trend === "down" && "rotate-90")} />
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
            <TabsTrigger value="deployed">Deployed Actions</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="logs">Execution Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="deployed" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search actions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Action
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                {filteredActions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Zap className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm font-medium">No actions found</p>
                    <p className="text-sm text-muted-foreground">
                      Create your first action or adjust your search
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredActions.map((action) => (
                      <div
                        key={action.id}
                        className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Zap className="h-5 w-5 text-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{action.name}</p>
                            <Badge
                              variant={action.status === "active" ? "outline" : "secondary"}
                              className={cn(
                                "text-xs",
                                action.status === "active" &&
                                  "border-green-200 bg-green-50 text-green-700"
                              )}
                            >
                              {action.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {action.description}
                          </p>
                        </div>
                        <div className="hidden flex-col items-end gap-1 md:flex">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{action.lastModified}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>v{action.version}</span>
                            <span>-</span>
                            <span>{action.runs?.toLocaleString() || 0} runs</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleToggleAction(action.id, action.status)}
                          >
                            {action.status === "active" ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleTestAction(action.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteAction(action.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Authentication">Authentication</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Tokens">Tokens</SelectItem>
                  <SelectItem value="Notifications">Notifications</SelectItem>
                  <SelectItem value="Integration">Integration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => {
                const Icon = getIcon(template.category);
                return (
                  <Card
                    key={template.id}
                    className="group cursor-pointer transition-all hover:shadow-md"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                          <Icon className="h-6 w-6 text-foreground" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <div className="mt-4">
                        <p className="font-medium">{template.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        {template.triggers.map((trigger) => (
                          <Badge key={trigger} variant="secondary" className="text-xs">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {template.popularity === "popular" && (
                            <>
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                              <span>Popular</span>
                            </>
                          )}
                          {template.popularity === "common" && (
                            <>
                              <Users className="h-3 w-3 text-blue-600" />
                              <span>Common</span>
                            </>
                          )}
                          {template.popularity === "advanced" && (
                            <>
                              <AlertTriangle className="h-3 w-3 text-orange-600" />
                              <span>Advanced</span>
                            </>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 opacity-0 group-hover:opacity-100"
                        >
                          Create
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Recent Executions</CardTitle>
                    <CardDescription>Latest action execution logs</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {actionLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm font-medium">No execution logs</p>
                    <p className="text-sm text-muted-foreground">
                      Action execution logs will appear here
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {actionLogs.map((log, index) => (
                      <div key={index} className="flex items-start gap-3 px-6 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted mt-0.5">
                          {log.status === "success" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{log.actionName}</p>
                            <Badge
                              variant={log.status === "success" ? "outline" : "destructive"}
                              className="text-xs"
                            >
                              {log.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{log.timestamp}</span>
                            <span>-</span>
                            <span>{log.duration}</span>
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
            <p className="text-sm font-medium">Need help with Actions?</p>
            <p className="text-sm text-muted-foreground">
              Check our documentation for examples and guides.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="https://docs.aetheridentity.dev/actions" target="_blank">
              Action Documentation
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
