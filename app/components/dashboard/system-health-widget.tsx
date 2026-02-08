"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Progress } from "@/components/dashboard/ui/progress";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Activity,
  ChevronRight,
  Server,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SystemHealthWidgetProps {
  status: "healthy" | "degraded" | "critical";
  uptime: string;
  components: {
    total: number;
    healthy: number;
    degraded: number;
    critical: number;
  };
  lastCheck: string;
}

export function SystemHealthWidget({
  status,
  uptime,
  components,
  lastCheck,
}: SystemHealthWidgetProps) {
  const healthyPercent = (components.healthy / components.total) * 100;
  const degradedPercent = (components.degraded / components.total) * 100;
  const criticalPercent = (components.critical / components.total) * 100;

  const statusConfig = {
    healthy: {
      icon: CheckCircle2,
      label: "Healthy",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
    },
    degraded: {
      icon: AlertCircle,
      label: "Degraded",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
    },
    critical: {
      icon: XCircle,
      label: "Critical",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        "border-border bg-card overflow-hidden",
        status === "critical" && "border-red-500/50",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
          </div>
          <div
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full",
              config.bgColor,
            )}
          >
            <Icon className={cn("h-3.5 w-3.5", config.color)} />
            <span className={cn("text-xs font-medium", config.color)}>
              {config.label}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Component Status</span>
            <span className="font-medium">
              {components.healthy}/{components.total} healthy
            </span>
          </div>
          <div className="h-2 flex rounded-full overflow-hidden">
            {components.healthy > 0 && (
              <div
                className="bg-emerald-500"
                style={{ width: `${healthyPercent}%` }}
              />
            )}
            {components.degraded > 0 && (
              <div
                className="bg-amber-500"
                style={{ width: `${degradedPercent}%` }}
              />
            )}
            {components.critical > 0 && (
              <div
                className="bg-red-500"
                style={{ width: `${criticalPercent}%` }}
              />
            )}
          </div>
        </div>

        {/* Component Breakdown */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded bg-emerald-500/10">
            <p className="text-lg font-semibold text-emerald-500">
              {components.healthy}
            </p>
            <p className="text-[10px] text-emerald-600 uppercase tracking-wide">
              Healthy
            </p>
          </div>
          <div className="p-2 rounded bg-amber-500/10">
            <p className="text-lg font-semibold text-amber-500">
              {components.degraded}
            </p>
            <p className="text-[10px] text-amber-600 uppercase tracking-wide">
              Degraded
            </p>
          </div>
          <div className="p-2 rounded bg-red-500/10">
            <p className="text-lg font-semibold text-red-500">
              {components.critical}
            </p>
            <p className="text-[10px] text-red-600 uppercase tracking-wide">
              Critical
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5" />
            <span>Uptime: {uptime}</span>
          </div>
          <span>Checked {lastCheck}</span>
        </div>

        {/* Link to details */}
        <Link
          href="/admin/platform/system"
          className="flex items-center justify-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors pt-2"
        >
          View System Details
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
