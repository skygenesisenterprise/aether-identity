"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Badge } from "@/components/dashboard/ui/badge";
import {
  UserPlus,
  UserCheck,
  Users,
  FileText,
  Settings,
  Shield,
  Lock,
  Ban,
  Terminal,
  Activity,
  Download,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  requiredScope?: string;
  variant?: "default" | "critical";
  disabled?: boolean;
}

interface QuickActionCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  actions: QuickAction[];
}

interface QuickActionsProps {
  userRole?: "admin" | "superadmin";
  userScopes?: string[];
}

const actionCategories: QuickActionCategory[] = [
  {
    id: "identity",
    title: "Identity Management",
    icon: Users,
    actions: [
      {
        id: "invite",
        label: "Invite User",
        description: "Send workspace invitation",
        icon: UserPlus,
        href: "/admin/users/invite",
        requiredScope: "admin:users:write",
      },
      {
        id: "review",
        label: "Review Access",
        description: "Audit user permissions",
        icon: UserCheck,
        href: "/admin/users/access",
        requiredScope: "admin:users:read",
      },
    ],
  },
  {
    id: "security",
    title: "Security Operations",
    icon: Shield,
    actions: [
      {
        id: "force-mfa",
        label: "Force MFA Reset",
        description: "Require users to reconfigure MFA",
        icon: Lock,
        href: "/admin/security/mfa",
        requiredScope: "admin:security:write",
      },
      {
        id: "revoke-sessions",
        label: "Revoke Sessions",
        description: "Force logout across all devices",
        icon: Ban,
        href: "/admin/security/sessions",
        requiredScope: "admin:security:write",
        variant: "critical",
      },
    ],
  },
  {
    id: "platform",
    title: "Platform",
    icon: Terminal,
    actions: [
      {
        id: "view-logs",
        label: "View Logs",
        description: "Browse system and audit logs",
        icon: FileText,
        href: "/admin/platform/logs",
        requiredScope: "admin:system:read",
      },
      {
        id: "diagnostics",
        label: "Run Diagnostics",
        description: "Check system health",
        icon: Activity,
        href: "/admin/platform/diagnostics",
        requiredScope: "admin:system:read",
      },
    ],
  },
  {
    id: "compliance",
    title: "Compliance",
    icon: ShieldAlert,
    actions: [
      {
        id: "export-audit",
        label: "Export Audit",
        description: "Download audit trail",
        icon: Download,
        href: "/admin/compliance/export",
        requiredScope: "admin:audit:read",
      },
      {
        id: "settings",
        label: "Settings",
        description: "Configure workspace policies",
        icon: Settings,
        href: "/admin/settings",
        requiredScope: "admin:settings:read",
      },
    ],
  },
];

export function QuickActions({
  userRole = "admin",
  userScopes = [],
}: QuickActionsProps) {
  // Helper to check if user has required scope
  const hasScope = (requiredScope?: string) => {
    if (!requiredScope) return true;
    if (userRole === "superadmin") return true;
    return userScopes.includes(requiredScope);
  };

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actionCategories.map((category) => {
          const CategoryIcon = category.icon;
          const visibleActions = category.actions.filter((action) =>
            hasScope(action.requiredScope),
          );

          if (visibleActions.length === 0) return null;

          return (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <CategoryIcon className="h-3.5 w-3.5" />
                {category.title}
              </div>
              <div className="space-y-1">
                {visibleActions.map((action) => {
                  const Icon = action.icon;
                  const isDisabled = action.disabled;

                  return (
                    <Link
                      key={action.id}
                      href={action.href || "#"}
                      className={cn(
                        "flex items-center gap-3 p-2.5 rounded-md transition-colors group",
                        isDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-muted cursor-pointer",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                          action.variant === "critical"
                            ? "bg-red-500/10 group-hover:bg-red-500/20"
                            : "bg-secondary group-hover:bg-muted",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 transition-colors",
                            action.variant === "critical"
                              ? "text-red-500"
                              : "text-muted-foreground group-hover:text-foreground",
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {action.label}
                          </p>
                          {action.variant === "critical" && (
                            <Badge
                              variant="destructive"
                              className="text-[10px] h-4 px-1"
                            >
                              Critical
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {action.description}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
