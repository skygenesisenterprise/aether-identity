import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Check,
  ArrowUpRight,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface SubscriptionCardProps {
  plan: {
    name: string;
    tier: "free" | "starter" | "professional" | "enterprise";
    price: number;
    interval: "monthly" | "yearly";
    status: "active" | "trialing" | "past_due" | "canceled" | "paused";
    trialEndsAt?: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
  };
  features: string[];
  onUpgrade?: () => void;
  onManage?: () => void;
}

const planConfig = {
  free: {
    label: "Free",
    color: "bg-muted text-muted-foreground",
    badgeVariant: "secondary" as const,
  },
  starter: {
    label: "Starter",
    color: "bg-blue-500/10 text-blue-500",
    badgeVariant: "default" as const,
  },
  professional: {
    label: "Professional",
    color: "bg-accent/10 text-accent",
    badgeVariant: "default" as const,
  },
  enterprise: {
    label: "Enterprise",
    color: "bg-purple-500/10 text-purple-500",
    badgeVariant: "secondary" as const,
  },
};

const statusConfig = {
  active: { label: "Active", variant: "default" as const, icon: Check },
  trialing: { label: "Trial", variant: "secondary" as const, icon: Sparkles },
  past_due: {
    label: "Payment Required",
    variant: "destructive" as const,
    icon: AlertCircle,
  },
  canceled: { label: "Canceled", variant: "secondary" as const, icon: null },
  paused: { label: "Paused", variant: "outline" as const, icon: null },
};

export function SubscriptionCard({
  plan,
  features,
  onUpgrade,
  onManage,
}: SubscriptionCardProps) {
  const planInfo = planConfig[plan.tier];
  const statusInfo = statusConfig[plan.status];
  const StatusIcon = statusInfo.icon;

  const isTrial = plan.status === "trialing";
  const isPastDue = plan.status === "past_due";
  const canUpgrade = plan.tier !== "enterprise";

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardDescription className="text-xs uppercase tracking-wide">
              Current Plan
            </CardDescription>
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl font-semibold">
                {plan.name}
              </CardTitle>
              <Badge
                variant={planInfo.badgeVariant}
                className={cn("font-medium", planInfo.color)}
              >
                {planInfo.label}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">
                ${plan.price}
              </span>
              <span className="text-sm text-muted-foreground">
                /{plan.interval === "monthly" ? "mo" : "yr"}
              </span>
            </div>
            {plan.interval === "yearly" && (
              <p className="text-xs text-accent">
                Save 20% with yearly billing
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <Badge
            variant={statusInfo.variant}
            className="flex items-center gap-1.5"
          >
            {StatusIcon && <StatusIcon className="h-3 w-3" />}
            {statusInfo.label}
          </Badge>
          {isTrial && plan.trialEndsAt && (
            <span className="text-sm text-muted-foreground">
              Trial ends {plan.trialEndsAt}
            </span>
          )}
        </div>

        {/* Billing Period */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Current period: {plan.currentPeriodStart} - {plan.currentPeriodEnd}
          </span>
        </div>

        {/* Warning for past due */}
        {isPastDue && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4" />
              Payment failed
            </div>
            <p className="mt-1 text-destructive/80">
              Please update your payment method to avoid service interruption.
            </p>
          </div>
        )}

        {/* Features List */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Plan includes:</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check className="h-4 w-4 text-accent shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          {canUpgrade && (
            <Button onClick={onUpgrade} className="gap-2">
              Upgrade Plan
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          )}
          <Button variant="outline" onClick={onManage}>
            Manage Subscription
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
