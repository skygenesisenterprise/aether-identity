import { Card, CardContent } from "@/components/dashboard/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "accent" | "warning" | "destructive";
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: MetricCardProps) {
  const iconColorClass = {
    default: "text-muted-foreground",
    accent: "text-accent",
    warning: "text-amber-400",
    destructive: "text-destructive",
  }[variant];

  const valueColorClass = {
    default: "text-foreground",
    accent: "text-accent",
    warning: "text-amber-400",
    destructive: "text-destructive",
  }[variant];

  return (
    <Card className="border-border bg-card hover:border-border/80 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
            <p
              className={cn(
                "text-2xl font-semibold tabular-nums",
                valueColorClass,
              )}
            >
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <p
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-accent" : "text-destructive",
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}% from last period
              </p>
            )}
          </div>
          <div className={cn("rounded-md bg-secondary p-2", iconColorClass)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
