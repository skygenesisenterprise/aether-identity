"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import { Progress } from "@/components/dashboard/ui/progress";
import {
  ArrowUpCircle,
  CheckCircle2,
  Download,
  AlertTriangle,
  ChevronRight,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type UpdateStatus =
  | "available"
  | "downloading"
  | "installing"
  | "completed"
  | "failed";
type UpdateSeverity = "critical" | "high" | "medium" | "low";
type UpdateType = "security" | "feature" | "patch";

interface SystemUpdate {
  id: string;
  version: string;
  type: UpdateType;
  severity: UpdateSeverity;
  releaseDate: string;
  description: string;
  size: string;
  status: UpdateStatus;
  progress?: number;
}

interface SystemUpdatesWidgetProps {
  updates: SystemUpdate[];
}

export function SystemUpdatesWidget({ updates }: SystemUpdatesWidgetProps) {
  const availableUpdates = updates.filter((u) => u.status === "available");
  const criticalUpdates = availableUpdates.filter(
    (u) => u.severity === "critical",
  );
  const completedUpdates = updates.filter((u) => u.status === "completed");

  const latestUpdate = updates[0];

  if (availableUpdates.length === 0) {
    return (
      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">
                System Updates
              </CardTitle>
            </div>
            <Badge className="text-xs bg-emerald-500/10 text-emerald-600">
              Up to date
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 py-2">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium">System is up to date</p>
              <p className="text-xs text-muted-foreground">
                Last updated: {completedUpdates[0]?.releaseDate || "Recently"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "border-border bg-card overflow-hidden",
        criticalUpdates.length > 0 && "border-red-500/50",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              System Updates
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {criticalUpdates.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {criticalUpdates.length} critical
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              {availableUpdates.length} available
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Latest Update */}
        {latestUpdate && (
          <div className="p-3 rounded-lg border border-border bg-muted/30">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    v{latestUpdate.version}
                  </span>
                  <SeverityBadge severity={latestUpdate.severity} />
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {latestUpdate.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {latestUpdate.description}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {latestUpdate.releaseDate}
                  </span>
                  <span>{latestUpdate.size}</span>
                </div>
              </div>
            </div>

            {latestUpdate.status === "installing" &&
              latestUpdate.progress !== undefined && (
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Installing...</span>
                    <span>{latestUpdate.progress}%</span>
                  </div>
                  <Progress value={latestUpdate.progress} className="h-1.5" />
                </div>
              )}

            <div className="mt-3">
              {latestUpdate.status === "available" && (
                <Button size="sm" className="h-8 text-xs w-full">
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Install Now
                </Button>
              )}
            </div>
          </div>
        )}

        {criticalUpdates.length > 0 && (
          <div className="p-2.5 rounded bg-red-500/10 border border-red-500/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-600">
                <span className="font-medium">Security updates available.</span>{" "}
                Installing critical patches is recommended to maintain system
                security.
              </p>
            </div>
          </div>
        )}

        <Link
          href="/admin/platform/system"
          className="flex items-center justify-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          View all updates
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}

function SeverityBadge({ severity }: { severity: UpdateSeverity }) {
  const configs = {
    critical: { color: "bg-red-500/10 text-red-600", label: "Critical" },
    high: { color: "bg-orange-500/10 text-orange-600", label: "High" },
    medium: { color: "bg-blue-500/10 text-blue-600", label: "Medium" },
    low: { color: "bg-slate-500/10 text-slate-600", label: "Low" },
  };

  const config = configs[severity];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase",
        config.color,
      )}
    >
      {config.label}
    </span>
  );
}
