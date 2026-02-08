"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/dashboard/ui/alert";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  X,
  ChevronRight,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

interface ActiveAlert {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "security" | "system" | "policy" | "compliance";
  title: string;
  description?: string;
  timestamp: string;
  actionRequired: boolean;
}

interface AlertsBannerProps {
  alerts: ActiveAlert[];
  maxDisplay?: number;
}

export function AlertsBanner({ alerts, maxDisplay = 3 }: AlertsBannerProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(
    new Set(),
  );

  const visibleAlerts = alerts
    .filter((alert) => !dismissedAlerts.has(alert.id))
    .slice(0, maxDisplay);

  const criticalCount = alerts.filter(
    (a) => a.severity === "critical" && !dismissedAlerts.has(a.id),
  ).length;
  const totalCount = alerts.filter((a) => !dismissedAlerts.has(a.id)).length;

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts((prev) => new Set([...prev, alertId]));
  };

  if (visibleAlerts.length === 0) {
    return (
      <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Bell className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-700">
              All Systems Operational
            </p>
            <p className="text-xs text-emerald-600">
              No active alerts at this time
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Active Alerts</span>
          {criticalCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {criticalCount} Critical
            </Badge>
          )}
        </div>
        {totalCount > maxDisplay && (
          <Link
            href="/admin/alerts"
            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
          >
            View all {totalCount}
            <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {/* Alerts List */}
      <div className="space-y-2">
        {visibleAlerts.map((alert) => (
          <AlertItem
            key={alert.id}
            alert={alert}
            onDismiss={() => handleDismiss(alert.id)}
          />
        ))}
      </div>
    </div>
  );
}

function AlertItem({
  alert,
  onDismiss,
}: {
  alert: ActiveAlert;
  onDismiss: () => void;
}) {
  const severityConfig = {
    critical: {
      icon: AlertCircle,
      borderColor: "border-red-500/50",
      bgColor: "bg-red-500/10",
      titleColor: "text-red-700",
      descriptionColor: "text-red-600",
    },
    high: {
      icon: AlertTriangle,
      borderColor: "border-orange-500/50",
      bgColor: "bg-orange-500/10",
      titleColor: "text-orange-700",
      descriptionColor: "text-orange-600",
    },
    medium: {
      icon: AlertTriangle,
      borderColor: "border-amber-500/50",
      bgColor: "bg-amber-500/10",
      titleColor: "text-amber-700",
      descriptionColor: "text-amber-600",
    },
    low: {
      icon: Info,
      borderColor: "border-blue-500/50",
      bgColor: "bg-blue-500/10",
      titleColor: "text-blue-700",
      descriptionColor: "text-blue-600",
    },
  };

  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative p-3 rounded-lg border",
        config.borderColor,
        config.bgColor,
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", config.titleColor)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={cn("text-sm font-medium", config.titleColor)}>
                {alert.title}
              </p>
              {alert.description && (
                <p className={cn("text-xs mt-0.5", config.descriptionColor)}>
                  {alert.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge
                variant="outline"
                className={cn("text-[10px] uppercase", config.descriptionColor)}
              >
                {alert.category}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-transparent"
                onClick={onDismiss}
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">
              {alert.timestamp}
            </span>
            {alert.actionRequired && (
              <Link
                href={`/admin/alerts/${alert.id}`}
                className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1"
              >
                Take Action
                <ChevronRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
