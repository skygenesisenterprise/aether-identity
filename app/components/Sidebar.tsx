"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    title: "Platform",
    href: "/admin/platform",
    icon: Building2,
    order: 1,
    children: [
      { title: "Identity", href: "/admin/platform/identity" },
      { title: "System", href: "/admin/platform/system" },
      { title: "Policy", href: "/admin/platform/policy" },
      { title: "Token", href: "/admin/platform/token" },
      { title: "Key", href: "/admin/platform/key" },
    ],
  },
  {
    title: "Organization",
    href: "/admin/organization",
    icon: Users,
    order: 2,
    children: [
      { title: "Structure", href: "/admin/organization/structure" },
      { title: "People", href: "/admin/organization/people" },
      { title: "RBAC", href: "/admin/organization/rbac" },
      { title: "Policies", href: "/admin/organization/policies" },
      { title: "Trust", href: "/admin/organization/trust" },
    ],
  },
  {
    title: "Operations",
    href: "/admin/operations",
    icon: Activity,
    order: 3,
    children: [
      { title: "Services", href: "/admin/operations/services" },
      { title: "Observability", href: "/admin/operations/observability" },
      { title: "Environments", href: "/admin/operations/environments" },
      { title: "Deployments", href: "/admin/operations/deployments" },
      { title: "Database", href: "/admin/operations/database" },
    ],
  },
  {
    title: "Security",
    href: "/admin/security",
    icon: Shield,
    order: 4,
    children: [
      { title: "Secrets", href: "/admin/security/secrets" },
      { title: "Audit", href: "/admin/security/audit" },
      { title: "Identity", href: "/admin/security/identity" },
      { title: "Compliance", href: "/admin/security/compliance" },
    ],
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    order: 5,
    children: [
      { title: "Naming", href: "/admin/settings/naming" },
      { title: "Context", href: "/admin/settings/context" },
      { title: "Data", href: "/admin/settings/data" },
      { title: "Automation", href: "/admin/settings/automation" },
      { title: "Notifications", href: "/admin/settings/notifications" },
      { title: "Views", href: "/admin/settings/views" },
      { title: "Workspace", href: "/admin/settings/workspace" },
    ],
  },
  {
    title: "Reports",
    href: "/admin/report",
    icon: FileText,
    order: 6,
    children: [
      { title: "Access", href: "/admin/report/access" },
      { title: "Compliance", href: "/admin/report/compliance" },
      { title: "Cross Authority", href: "/admin/report/cross_authority" },
      { title: "Dormant", href: "/admin/report/dormant" },
      { title: "Privilege", href: "/admin/report/privilege" },
    ],
  },
  {
    title: "Integrations",
    href: "/admin/integrations",
    icon: Puzzle,
    order: 7,
    children: [
      { title: "External", href: "/admin/integrations/external" },
      { title: "Providers", href: "/admin/integrations/providers" },
      { title: "Provisioning", href: "/admin/integrations/provisioning" },
      { title: "Webhooks", href: "/admin/integrations/webhooks" },
    ],
  },
];

interface MenuItemProps {
  item: MenuItem | ChildMenuItem;
  level?: number;
  pathname: string;
  expandedItems: Set<string>;
  toggleExpanded: (item: string) => void;
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
  expandedItems: Set<string>,
  toggleExpanded: (item: string) => void,
): React.ReactElement {
  const isExpanded =
    expandedItems.has(item.href) ||
    (hasActiveChild(item.children || [], pathname) &&
      !expandedItems.has(item.href));
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;

  const marginLeft = level * 12;

  if (hasChildren) {
    return (
      <div key={item.href} className="w-full">
        <Button
          variant="ghost"
          onClick={() => toggleExpanded(item.href)}
          className={cn(
            "w-full justify-between h-6 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide hover:bg-gray-800",
            isActive && "text-blue-400 hover:bg-gray-800",
          )}
          style={{ marginLeft: `${marginLeft}px` }}
        >
          <span className="text-left truncate max-w-[140px]">{item.title}</span>
          <ChevronDown
            className={cn(
              "h-3 w-3 shrink-0 transition-transform",
              isExpanded && "rotate-180",
            )}
          />
        </Button>
        {isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) =>
              renderChildMenuItem(
                child,
                level + 1,
                pathname,
                expandedItems,
                toggleExpanded,
              ),
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      key={item.href}
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-between h-8 px-2 text-sm font-normal text-gray-300 hover:bg-gray-800",
        isActive && "bg-gray-800 text-blue-400 hover:bg-gray-700",
      )}
      style={{ marginLeft: `${marginLeft}px` }}
    >
      <Link
        href={item.href}
        className="flex justify-between items-center w-full"
      >
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-gray-600 rounded-full shrink-0" />
          <span className="truncate max-w-[140px]">{item.title}</span>
        </span>
      </Link>
    </Button>
  );
}

function MenuItem({
  item,
  level = 0,
  pathname,
  expandedItems,
  toggleExpanded,
}: MenuItemProps) {
  const isExpanded =
    expandedItems.has(item.href) ||
    (hasActiveChild(item.children || [], pathname) &&
      !expandedItems.has(item.href));
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;

  const marginLeft = level * 12;

  // Type guard to check if item is a MenuItem (has icon)
  const isMenuItem = (item: MenuItem | ChildMenuItem): item is MenuItem => {
    return "icon" in item && item.icon !== undefined;
  };

  if (hasChildren) {
    return (
      <div className="w-full">
        <Button
          variant="ghost"
          onClick={() => toggleExpanded(item.href)}
          className={cn(
            "w-full justify-start gap-2 h-8 px-2 text-sm font-normal text-gray-300 hover:bg-gray-800",
            isActive && "bg-gray-800 text-blue-400 hover:bg-gray-700",
          )}
          style={{ marginLeft: `${marginLeft}px` }}
        >
          {isMenuItem(item) && <item.icon className="h-4 w-4 shrink-0" />}
          <span className="flex-1 text-left truncate max-w-[120px]">
            {item.title}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform",
              isExpanded && "rotate-180",
            )}
          />
        </Button>
        {isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) =>
              renderChildMenuItem(
                child,
                level + 1,
                pathname,
                expandedItems,
                toggleExpanded,
              ),
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 h-8 px-2 text-sm font-normal text-gray-300 hover:bg-gray-800",
        isActive && "bg-gray-800 text-blue-400 hover:bg-gray-700",
      )}
      style={{ marginLeft: `${marginLeft}px` }}
    >
      <Link href={item.href}>
        {isMenuItem(item) && <item.icon className="h-4 w-4 shrink-0" />}
        <span className="truncate max-w-[100px]">{item.title}</span>
      </Link>
    </Button>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
    new Set(),
  );

  const toggleExpanded = (item: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item);
      }
      return newSet;
    });
  };

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 border-r border-gray-800">
      <div className="flex h-14 items-center border-b border-gray-800 px-4">
        <Link href="/admin/home" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-400" />
          <h1 className="text-lg font-semibold text-gray-200">Admin Console</h1>
        </Link>
      </div>
      <nav className="flex-1 overflow-hidden p-2 space-y-1 hover:overflow-auto">
        {menuItems
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <MenuItem
              key={item.href}
              item={item}
              pathname={pathname}
              expandedItems={expandedItems}
              toggleExpanded={toggleExpanded}
            />
          ))}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-gray-800 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">AD</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-200">
              Admin User
            </span>
            <span className="text-xs text-gray-400">admin@company.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
