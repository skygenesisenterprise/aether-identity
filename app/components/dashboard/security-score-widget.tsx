"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { Progress } from "@/components/dashboard/ui/progress";
import {
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SecurityScoreWidgetProps {
  score: number;
  trend: "up" | "down" | "stable";
  previousScore: number;
  criticalFindings: number;
}

export function SecurityScoreWidget({
  score,
  trend,
  previousScore,
  criticalFindings,
}: SecurityScoreWidgetProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80)
      return {
        text: "text-emerald-500",
        bg: "bg-emerald-500",
        ring: "ring-emerald-500/20",
      };
    if (value >= 60)
      return {
        text: "text-amber-500",
        bg: "bg-amber-500",
        ring: "ring-amber-500/20",
      };
    return { text: "text-red-500", bg: "bg-red-500", ring: "ring-red-500/20" };
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />;
      case "down":
        return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
      default:
        return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const scoreColor = getScoreColor(score);
  const scoreDiff = score - previousScore;

  return (
    <Card
      className={cn(
        "border-border bg-card overflow-hidden",
        score < 60 && "border-red-500/50",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              Security Score
            </CardTitle>
          </div>
          {criticalFindings > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10">
              <ShieldAlert className="h-3 w-3 text-red-500" />
              <span className="text-[10px] font-medium text-red-500">
                {criticalFindings} Critical
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Circle */}
        <div className="flex items-center justify-center">
          <div
            className={cn(
              "relative w-24 h-24 rounded-full ring-4 flex items-center justify-center",
              scoreColor.ring,
            )}
          >
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted/20"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className={scoreColor.text}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${score}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("text-2xl font-bold", scoreColor.text)}>
                {score}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase">
                / 100
              </span>
            </div>
          </div>
        </div>

        {/* Trend */}
        <div className="flex items-center justify-center gap-2">
          {getTrendIcon()}
          <span
            className={cn(
              "text-sm font-medium",
              trend === "up"
                ? "text-emerald-500"
                : trend === "down"
                  ? "text-red-500"
                  : "text-muted-foreground",
            )}
          >
            {scoreDiff > 0 ? "+" : ""}
            {scoreDiff} from last week
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <Progress value={score} className="h-1.5" />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        {/* Critical warning */}
        {criticalFindings > 0 && (
          <div className="p-2.5 rounded bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-red-600">
              <span className="font-medium">Action required:</span>{" "}
              {criticalFindings} critical security finding
              {criticalFindings > 1 ? "s" : ""} need immediate attention
            </p>
          </div>
        )}

        {/* Link */}
        <Link
          href="/admin/platform/policy"
          className="flex items-center justify-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors pt-2"
        >
          View Security Details
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
