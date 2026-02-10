import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { Progress } from "@/components/dashboard/ui/progress";
import { Badge } from "@/components/dashboard/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, Users, Fingerprint, Zap, Database } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface UsageMetric {
  id: string;
  name: string;
  icon: LucideIcon;
  used: number;
  limit: number;
  unit: string;
  warningThreshold?: number;
}

interface UsageStatsProps {
  metrics: UsageMetric[];
  planName: string;
}

function getProgressColor(percentage: number, warningThreshold = 80): string {
  if (percentage >= 100) return "bg-destructive";
  if (percentage >= warningThreshold) return "bg-amber-400";
  return "bg-accent";
}

function getStatusBadge(percentage: number, warningThreshold = 80) {
  if (percentage >= 100) {
    return (
      <Badge variant="destructive" className="text-xs">
        Limit reached
      </Badge>
    );
  }
  if (percentage >= warningThreshold) {
    return (
      <Badge
        variant="outline"
        className="text-xs border-amber-400 text-amber-400"
      >
        <AlertTriangle className="h-3 w-3 mr-1" />
        Approaching limit
      </Badge>
    );
  }
  return null;
}

export function UsageStats({ metrics, planName }: UsageStatsProps) {
  const hasWarnings = metrics.some(
    (m) => (m.used / m.limit) * 100 >= (m.warningThreshold || 80),
  );

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Usage & Limits
            </CardTitle>
            <CardDescription className="text-sm">
              Resource consumption for {planName}
            </CardDescription>
          </div>
          {hasWarnings && (
            <Badge
              variant="outline"
              className="border-amber-400 text-amber-400"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Review needed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {metrics.map((metric) => {
          const percentage = Math.min((metric.used / metric.limit) * 100, 100);
          const progressColor = getProgressColor(
            percentage,
            metric.warningThreshold,
          );
          const statusBadge = getStatusBadge(
            percentage,
            metric.warningThreshold,
          );
          const Icon = metric.icon;

          return (
            <div key={metric.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-md bg-secondary flex items-center justify-center",
                      percentage >= (metric.warningThreshold || 80) &&
                        percentage < 100
                        ? "text-amber-400"
                        : percentage >= 100
                          ? "text-destructive"
                          : "text-muted-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {metric.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {metric.used.toLocaleString("en-US")} of{" "}
                      {metric.limit.toLocaleString("en-US")} {metric.unit}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {statusBadge}
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      percentage >= 100
                        ? "text-destructive"
                        : percentage >= (metric.warningThreshold || 80)
                          ? "text-amber-400"
                          : "text-foreground",
                    )}
                  >
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="relative">
                <Progress value={percentage} className="h-2 bg-secondary" />
                <div
                  className={cn(
                    "absolute top-0 left-0 h-2 rounded-full transition-all",
                    progressColor,
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Limits reset at the start of each billing period. Need more?{" "}
            <a href="#" className="text-accent hover:underline font-medium">
              Upgrade your plan
            </a>{" "}
            or{" "}
            <a href="#" className="text-accent hover:underline font-medium">
              contact sales
            </a>{" "}
            for custom limits.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
