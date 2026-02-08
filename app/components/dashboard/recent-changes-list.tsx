"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Clock, Lock, UserCog, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface RecentChange {
  id: string;
  type: "policy" | "access" | "role" | "system";
  description: string;
  actor: string;
  timestamp: string;
  severity: "normal" | "high" | "critical";
}

interface RecentChangesListProps {
  changes: RecentChange[];
  maxDisplay?: number;
}

export function RecentChangesList({
  changes,
  maxDisplay = 5,
}: RecentChangesListProps) {
  const visibleChanges = changes.slice(0, maxDisplay);

  const getTypeIcon = (type: RecentChange["type"]) => {
    switch (type) {
      case "policy":
        return <FileText className="h-3.5 w-3.5" />;
      case "access":
        return <Lock className="h-3.5 w-3.5" />;
      case "role":
        return <UserCog className="h-3.5 w-3.5" />;
      case "system":
        return <Clock className="h-3.5 w-3.5" />;
      default:
        return <FileText className="h-3.5 w-3.5" />;
    }
  };

  const getTypeColor = (type: RecentChange["type"]) => {
    switch (type) {
      case "policy":
        return "text-blue-500 bg-blue-500/10";
      case "access":
        return "text-purple-500 bg-purple-500/10";
      case "role":
        return "text-amber-500 bg-amber-500/10";
      case "system":
        return "text-slate-500 bg-slate-500/10";
      default:
        return "text-slate-500 bg-slate-500/10";
    }
  };

  const getSeverityColor = (severity: RecentChange["severity"]) => {
    switch (severity) {
      case "critical":
        return "text-red-500";
      case "high":
        return "text-orange-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Recent Changes</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {changes.length} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {visibleChanges.map((change, index) => (
            <div
              key={change.id}
              className={cn(
                "flex gap-3 py-3",
                index !== visibleChanges.length - 1 &&
                  "border-b border-border/50",
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  getTypeColor(change.type),
                )}
              >
                {getTypeIcon(change.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={cn(
                      "text-sm font-medium leading-tight",
                      getSeverityColor(change.severity),
                    )}
                  >
                    {change.description}
                  </p>
                  <Badge variant="outline" className="text-[10px] shrink-0">
                    {change.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                  <span>by {change.actor}</span>
                  <span>•</span>
                  <span>{change.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {changes.length > maxDisplay && (
          <Link
            href="/admin/audit"
            className="flex items-center justify-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors mt-4 pt-3 border-t"
          >
            View all {changes.length} changes
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
