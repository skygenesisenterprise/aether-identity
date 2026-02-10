"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/dashboard/ui/collapsible";

import {
  LayoutDashboard,
  Building2,
  Settings,
  Shield,
  Users,
  FileText,
  Puzzle,
  Activity,
  LucideIcon,
  ChevronDown,
  Globe,
  Layers,
  Server,
  Database,
  Cloud,
  Link2,
  UserCircle,
  UsersRound,
  ShieldCheck,
  FileKey,
  Building,
  FileLock,
  FileWarning,
  FileSearch,
  Lock,
  Key,
  Eye,
  ShieldAlert,
  UserCog,
  Bell,
  EyeIcon,
  Workflow,
  Mail,
  Palette,
  Briefcase,
  Settings2,
  Github,
  ExternalLink,
  ArchiveRestore,
  ListChecks,
  FolderTree,
  Share2,
  AppWindow,
  RefreshCw,
  IdCard,
  Zap,
  Monitor,
  LogIn,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Code,
  Brain,
  Network,
  ShieldOff,
  Smartphone,
  Crown,
  Fingerprint,
  Scale,
} from "lucide-react";

interface ChildMenuItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  children?: ChildMenuItem[];
}

interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  order: number;
  children?: ChildMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/admin/home",
    icon: LayoutDashboard,
    order: 0,
  },
  {
    title: "Integrations",
    href: "/admin/integrations",
    icon: Puzzle,
    order: 1,
    children: [
      { title: "External", href: "/admin/integrations/external", icon: Globe },
      {
        title: "Providers",
        href: "/admin/integrations/providers",
        icon: Layers,
      },
      {
        title: "Provisioning",
        href: "/admin/integrations/provisioning",
        icon: Server,
      },
      { title: "Webhooks", href: "/admin/integrations/webhooks", icon: Link2 },
      {
        title: "Services",
        href: "/admin/integrations/services",
        icon: AppWindow,
      },
      { title: "Email", href: "/admin/integrations/email", icon: Mail },
      { title: "SCIM", href: "/admin/integrations/scim", icon: Share2 },
      {
        title: "Directory",
        href: "/admin/integrations/directory",
        icon: FolderTree,
      },
      { title: "Logs", href: "/admin/integrations/logs", icon: FileText },
    ],
  },
  {
    title: "Operations",
    href: "/admin/operations",
    icon: Activity,
    order: 2,
    children: [
      { title: "Services", href: "/admin/operations/services", icon: Cloud },
      {
        title: "Observability",
        href: "/admin/operations/observability",
        icon: Eye,
      },
      {
        title: "Environments",
        href: "/admin/operations/environments",
        icon: Server,
      },
      {
        title: "Deployments",
        href: "/admin/operations/deployments",
        icon: Workflow,
      },
      { title: "Database", href: "/admin/operations/database", icon: Database },
      {
        title: "Backups",
        href: "/admin/operations/backups",
        icon: ArchiveRestore,
      },
      { title: "Tasks", href: "/admin/operations/tasks", icon: ListChecks },
      {
        title: "Capacity",
        href: "/admin/operations/capacity",
        icon: TrendingUp,
      },
      { title: "Costs", href: "/admin/operations/costs", icon: DollarSign },
      { title: "DR", href: "/admin/operations/dr", icon: AlertTriangle },
      { title: "IaC", href: "/admin/operations/iac", icon: Code },
      { title: "Logs", href: "/admin/operations/logs", icon: FileText },
    ],
  },
  {
    title: "Organization",
    href: "/admin/organization",
    icon: Users,
    order: 3,
    children: [
      {
        title: "Structure",
        href: "/admin/organization/structure",
        icon: Building,
      },
      { title: "People", href: "/admin/organization/people", icon: UserCircle },
      { title: "Groups", href: "/admin/organization/groups", icon: Users },
      { title: "Profiles", href: "/admin/organization/profiles", icon: IdCard },
      {
        title: "Lifecycle",
        href: "/admin/organization/lifecycle",
        icon: RefreshCw,
      },
      {
        title: "Provisioning",
        href: "/admin/organization/provisioning",
        icon: Zap,
      },
      {
        title: "Sessions",
        href: "/admin/organization/sessions",
        icon: Monitor,
      },
      { title: "RBAC", href: "/admin/organization/rbac", icon: ShieldCheck },
      {
        title: "Policies",
        href: "/admin/organization/policies",
        icon: FileLock,
      },
      { title: "Trust", href: "/admin/organization/trust", icon: Shield },
      { title: "Logs", href: "/admin/organization/logs", icon: FileText },
    ],
  },
  {
    title: "Platform",
    href: "/admin/platform",
    icon: Building2,
    order: 4,
    children: [
      { title: "Identity", href: "/admin/platform/identity", icon: UserCircle },
      { title: "SSO", href: "/admin/platform/sso", icon: LogIn },
      { title: "System", href: "/admin/platform/system", icon: Settings2 },
      { title: "Policy", href: "/admin/platform/policy", icon: FileLock },
      { title: "Token", href: "/admin/platform/token", icon: Key },
      { title: "Key", href: "/admin/platform/key", icon: Lock },
      { title: "Logs", href: "/admin/platform/logs", icon: FileText },
    ],
  },
  {
    title: "Reports",
    href: "/admin/report",
    icon: FileText,
    order: 5,
    children: [
      { title: "Access", href: "/admin/report/access", icon: FileSearch },
      {
        title: "Compliance",
        href: "/admin/report/compliance",
        icon: ShieldCheck,
      },
      {
        title: "Cross Authority",
        href: "/admin/report/cross_authority",
        icon: UsersRound,
      },
      { title: "Dormant", href: "/admin/report/dormant", icon: FileWarning },
      { title: "Privilege", href: "/admin/report/privilege", icon: FileKey },
      { title: "Behavior", href: "/admin/report/behavior", icon: Brain },
      { title: "Logs", href: "/admin/report/logs", icon: FileText },
    ],
  },
  {
    title: "Security",
    href: "/admin/security",
    icon: Shield,
    order: 6,
    children: [
      { title: "Secrets", href: "/admin/security/secrets", icon: Lock },
      { title: "Audit", href: "/admin/security/audit", icon: EyeIcon },
      { title: "Identity", href: "/admin/security/identity", icon: UserCog },
      {
        title: "Compliance",
        href: "/admin/security/compliance",
        icon: ShieldCheck,
      },
      { title: "MFA", href: "/admin/security/mfa", icon: Smartphone },
      {
        title: "Passwords",
        href: "/admin/security/passwords",
        icon: Fingerprint,
      },
      {
        title: "Conditional",
        href: "/admin/security/conditional",
        icon: Network,
      },
      { title: "DLP", href: "/admin/security/dlp", icon: ShieldOff },
      { title: "PAM", href: "/admin/security/pam", icon: Crown },
      {
        title: "Threats",
        href: "/admin/security/threats",
        icon: AlertTriangle,
      },
      { title: "Logs", href: "/admin/security/logs", icon: FileText },
    ],
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    order: 7,
    children: [
      { title: "Naming", href: "/admin/settings/naming", icon: FileText },
      { title: "Context", href: "/admin/settings/context", icon: Layers },
      { title: "Data", href: "/admin/settings/data", icon: Database },
      {
        title: "Automation",
        href: "/admin/settings/automation",
        icon: Workflow,
      },
      {
        title: "Notifications",
        href: "/admin/settings/notifications",
        icon: Bell,
      },
      { title: "Views", href: "/admin/settings/views", icon: Eye },
      {
        title: "Workspace",
        href: "/admin/settings/workspace",
        icon: Briefcase,
      },
      { title: "Governance", href: "/admin/settings/governance", icon: Scale },
    ],
  },
];

interface MenuItemProps {
  item: MenuItem | ChildMenuItem;
  level?: number;
  pathname: string;
}

function hasActiveChild(children: ChildMenuItem[], pathname: string): boolean {
  return (
    children?.some((child) => {
      const isChildActive =
        pathname === child.href || pathname.startsWith(child.href + "/");
      const hasActiveGrandChildren = child.children
        ? hasActiveChild(child.children, pathname)
        : false;
      return isChildActive || hasActiveGrandChildren;
    }) ?? false
  );
}

function renderChildMenuItem(
  item: ChildMenuItem,
  level: number,
  pathname: string,
): React.ReactElement {
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = hasActiveChild(item.children || [], pathname);
  const defaultOpen = isActive || isChildActive;

  const marginLeft = level * 12;

  if (hasChildren) {
    return (
      <Collapsible key={item.href} defaultOpen={defaultOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between h-6 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:bg-sidebar-accent",
              (isActive || isChildActive) &&
                "text-black bg-sidebar-accent hover:bg-sidebar-accent",
            )}
            style={{ marginLeft: `${marginLeft}px` }}
          >
            <span className="flex items-center gap-2">
              {item.icon && <item.icon className="h-3 w-3 shrink-0" />}
              <span className="text-left truncate max-w-[120px]">
                {item.title}
              </span>
            </span>
            <ChevronDown className="h-3 w-3 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
          <div className="mt-1 space-y-1">
            {item.children?.map((child) =>
              renderChildMenuItem(child, level + 1, pathname),
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      key={item.href}
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-between h-8 px-2 text-sm font-normal text-sidebar-foreground hover:bg-sidebar-accent",
        isActive && "bg-sidebar-accent text-black hover:bg-sidebar-accent/80",
      )}
      style={{ marginLeft: `${marginLeft}px` }}
    >
      <Link
        href={item.href}
        className="flex justify-between items-center w-full"
      >
        <span className="flex items-center gap-2">
          {item.icon ? (
            <item.icon
              className={cn(
                "h-3 w-3 shrink-0",
                isActive ? "text-black" : "text-muted-foreground",
              )}
            />
          ) : (
            <span
              className={cn(
                "w-2 h-2 rounded-full shrink-0",
                isActive ? "bg-black" : "bg-muted-foreground/50",
              )}
            />
          )}
          <span className="truncate max-w-[140px]">{item.title}</span>
        </span>
      </Link>
    </Button>
  );
}

function MenuItem({ item, level = 0, pathname }: MenuItemProps) {
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = hasActiveChild(item.children || [], pathname);
  const defaultOpen = isActive || isChildActive;

  const marginLeft = level * 12;

  // Type guard to check if item is a MenuItem (has icon)
  const isMenuItem = (item: MenuItem | ChildMenuItem): item is MenuItem => {
    return "icon" in item && item.icon !== undefined;
  };

  if (hasChildren) {
    return (
      <Collapsible defaultOpen={defaultOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between gap-2 h-8 px-2 text-sm font-normal text-sidebar-foreground hover:bg-sidebar-accent group",
              (isActive || isChildActive) &&
                "bg-sidebar-accent text-black hover:bg-sidebar-accent/80",
            )}
            style={{ marginLeft: `${marginLeft}px` }}
          >
            <span className="flex items-center gap-2">
              {isMenuItem(item) && (
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    (isActive || isChildActive) && "text-black",
                  )}
                />
              )}
              <span className="text-left truncate max-w-[120px]">
                {item.title}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
          <div className="mt-1 space-y-1">
            {item.children?.map((child) =>
              renderChildMenuItem(child, level + 1, pathname),
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 h-8 px-2 text-sm font-normal text-sidebar-foreground hover:bg-sidebar-accent",
        isActive && "bg-sidebar-accent text-black hover:bg-sidebar-accent/80",
      )}
      style={{ marginLeft: `${marginLeft}px` }}
    >
      <Link href={item.href}>
        {isMenuItem(item) && (
          <item.icon
            className={cn("h-4 w-4 shrink-0", isActive && "text-black")}
          />
        )}
        <span className="truncate max-w-[100px]">{item.title}</span>
      </Link>
    </Button>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo Header */}
      <div className="border-b border-sidebar-border p-3">
        <Link
          href="/admin/home"
          className="flex items-center gap-2 px-2 py-1.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">
            Aether Identity
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-hidden p-2 space-y-1 hover:overflow-auto">
        {menuItems
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <MenuItem key={item.href} item={item} pathname={pathname} />
          ))}
      </nav>
      <div className="border-t border-sidebar-border p-2 space-y-1">
        <Button
          asChild
          variant="ghost"
          className="w-full justify-start gap-2 h-8 px-2 text-sm font-normal text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <a
            href="https://github.com/skygenesisenterprise/aether-identity"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Github className="h-4 w-4 shrink-0" />
            <span className="truncate">GitHub Project</span>
            <ExternalLink className="h-3 w-3 shrink-0 ml-auto text-muted-foreground" />
          </a>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="w-full justify-start gap-2 h-8 px-2 text-sm font-normal text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <a
            href="https://skygenesisenterprise.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4 shrink-0" />
            <span className="truncate">Main Website</span>
            <ExternalLink className="h-3 w-3 shrink-0 ml-auto text-muted-foreground" />
          </a>
        </Button>
      </div>
    </div>
  );
}
