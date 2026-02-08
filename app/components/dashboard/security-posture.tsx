"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { Progress } from "@/components/dashboard/ui/progress";
import { Badge } from "@/components/dashboard/ui/badge";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  AlertTriangle,
  Users,
  XCircle,
  Activity,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SecurityItem {
  label: string;
  value: number;
  maxValue: number;
  status: "good" | "warning" | "critical";
}

interface PolicyChange {
  description: string;
  timestamp: string;
  type: "policy" | "access" | "role";
}

interface RiskIndicators {
  highRiskUsers: number;
  failedLogins24h: number;
  anomalousActivities: number;
}

interface SecurityPostureProps {
  mfaAdoptionRate: number;
  flaggedIdentities: number;
  securityScore: number;
  recentChanges: PolicyChange[];
  riskIndicators?: RiskIndicators;
}

export function SecurityPosture({
  mfaAdoptionRate,
  flaggedIdentities,
  securityScore,
  recentChanges,
  riskIndicators = {
    highRiskUsers: 0,
    failedLogins24h: 0,
    anomalousActivities: 0,
  },
}: SecurityPostureProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent";
    if (score >= 60) return "text-amber-400";
    return "text-destructive";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-accent";
    if (score >= 60) return "bg-amber-400";
    return "bg-destructive";
  };

  const securityItems: SecurityItem[] = [
    {
      label: "MFA Adoption",
      value: mfaAdoptionRate,
      maxValue: 100,
      status:
        mfaAdoptionRate >= 90
          ? "good"
          : mfaAdoptionRate >= 70
            ? "warning"
            : "critical",
    },
    {
      label: "Password Policy Compliance",
      value: 94,
      maxValue: 100,
      status: "good",
    },
    {
      label: "Session Security",
      value: 88,
      maxValue: 100,
      status: "good",
    },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-foreground">
            Security & Access Posture
          </CardTitle>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1",
                securityScore >= 80
                  ? "bg-accent/10"
                  : securityScore >= 60
                    ? "bg-amber-500/10"
                    : "bg-destructive/10",
              )}
            >
              {securityScore >= 80 ? (
                <ShieldCheck
                  className={cn("h-3.5 w-3.5", getScoreColor(securityScore))}
                />
              ) : (
                <ShieldAlert
                  className={cn("h-3.5 w-3.5", getScoreColor(securityScore))}
                />
              )}
              <span
                className={cn(
                  "text-sm font-semibold",
                  getScoreColor(securityScore),
                )}
              >
                {securityScore}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Security Metrics */}
        <div className="space-y-3">
          {securityItems.map((item) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.label}</span>
                <span
                  className={cn(
                    "font-medium",
                    item.status === "good"
                      ? "text-accent"
                      : item.status === "warning"
                        ? "text-amber-400"
                        : "text-destructive",
                  )}
                >
                  {item.value}%
                </span>
              </div>
              <Progress
                value={item.value}
                className={cn(
                  "h-1.5 bg-secondary",
                  item.status === "good"
                    ? "[&>div]:bg-accent"
                    : item.status === "warning"
                      ? "[&>div]:bg-amber-400"
                      : "[&>div]:bg-destructive",
                )}
              />
            </div>
          ))}
        </div>

        {/* Risk Indicators Grid */}
        <div className="grid grid-cols-3 gap-3">
          <RiskIndicatorCard
            icon={Users}
            label="High-Risk Users"
            value={riskIndicators.highRiskUsers}
            href="/admin/security/users"
            variant={riskIndicators.highRiskUsers > 0 ? "warning" : "good"}
          />
          <RiskIndicatorCard
            icon={XCircle}
            label="Failed Logins (24h)"
            value={riskIndicators.failedLogins24h}
            href="/admin/security/events"
            variant={
              riskIndicators.failedLogins24h > 10
                ? "critical"
                : riskIndicators.failedLogins24h > 0
                  ? "warning"
                  : "good"
            }
          />
          <RiskIndicatorCard
            icon={Activity}
            label="Anomalies"
            value={riskIndicators.anomalousActivities}
            href="/admin/security/anomalies"
            variant={
              riskIndicators.anomalousActivities > 0 ? "warning" : "good"
            }
          />
        </div>

        {/* Flagged Identities */}
        {flaggedIdentities > 0 && (
          <div className="flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-3">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-400">
                {flaggedIdentities} High-Risk{" "}
                {flaggedIdentities === 1 ? "Identity" : "Identities"}
              </p>
              <p className="text-xs text-muted-foreground">
                Requires review and potential remediation
              </p>
            </div>
          </div>
        )}

        {/* Recent Policy Changes */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Recent Changes
          </p>
          <div className="space-y-2">
            {recentChanges.map((change, index) => (
              <div key={index} className="flex items-start gap-2 text-xs">
                <Lock className="mt-0.5 h-3 w-3 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-foreground">{change.description}</p>
                  <p className="text-muted-foreground">{change.timestamp}</p>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] border-border text-muted-foreground"
                >
                  {change.type}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Sub-component for risk indicator cards
interface RiskIndicatorCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  href: string;
  variant: "good" | "warning" | "critical";
}

function RiskIndicatorCard({
  icon: Icon,
  label,
  value,
  href,
  variant,
}: RiskIndicatorCardProps) {
  const variantStyles = {
    good: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600",
      icon: "text-emerald-500",
    },
    warning: {
      bg: "bg-amber-500/10",
      text: "text-amber-600",
      icon: "text-amber-500",
    },
    critical: {
      bg: "bg-red-500/10",
      text: "text-red-600",
      icon: "text-red-500",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center p-3 rounded-lg transition-colors hover:opacity-80",
        styles.bg,
      )}
    >
      <Icon className={cn("h-4 w-4 mb-1.5", styles.icon)} />
      <span className={cn("text-lg font-bold", styles.text)}>{value}</span>
      <span className="text-[10px] text-muted-foreground text-center leading-tight">
        {label}
      </span>
    </Link>
  );
}
