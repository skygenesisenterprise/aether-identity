"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  Home,
  Zap,
  Lightbulb,
  UserCircle,
  Package,
  Puzzle,
  BookOpen,
  Shield,
  Server,
  Settings,
  GitBranch,
  FileText,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  children?: NavItem[];
}

const NAVIGATION: NavItem[] = [
  {
    title: "Getting Started",
    href: "/docs/getting-started",
    icon: <Zap className="h-4 w-4" />,
    children: [
      { title: "Introduction", href: "/docs/getting-started/introduction" },
      { title: "Quick Start", href: "/docs/getting-started/quick-start" },
      { title: "Installation", href: "/docs/getting-started/installation" },
      { title: "Configuration", href: "/docs/getting-started/configuration" },
    ],
  },
  {
    title: "Concepts",
    href: "/docs/concepts",
    icon: <Lightbulb className="h-4 w-4" />,
    children: [
      { title: "Architecture", href: "/docs/concepts/architecture" },
      { title: "Identity Model", href: "/docs/concepts/identity-model" },
      { title: "Authentication", href: "/docs/concepts/authentication" },
      { title: "Authorization", href: "/docs/concepts/authorization" },
    ],
  },
  {
    title: "Identity",
    href: "/docs/identity",
    icon: <UserCircle className="h-4 w-4" />,
    children: [
      { title: "Users", href: "/docs/identity/users" },
      { title: "Organizations", href: "/docs/identity/organizations" },
      { title: "Credentials", href: "/docs/identity/credentials" },
      { title: "Sessions", href: "/docs/identity/sessions" },
    ],
  },
  {
    title: "SDK",
    href: "/docs/sdk",
    icon: <Package className="h-4 w-4" />,
    badge: "New",
    children: [
      { title: "Core SDK", href: "/docs/sdk/core" },
      { title: "Runtime", href: "/docs/sdk/runtime" },
      { title: "Extensions", href: "/docs/sdk/extensions" },
      { title: "Tools & CLI", href: "/docs/sdk/tools" },
    ],
  },
  {
    title: "Integrations",
    href: "/docs/integrations",
    icon: <Puzzle className="h-4 w-4" />,
    children: [
      { title: "OAuth 2.0 / OIDC", href: "/docs/integrations/oauth2" },
      { title: "SAML", href: "/docs/integrations/saml" },
      { title: "LDAP / Active Directory", href: "/docs/integrations/ldap" },
      { title: "Webhooks", href: "/docs/integrations/webhooks" },
    ],
  },
  {
    title: "Reference",
    href: "/docs/reference",
    icon: <BookOpen className="h-4 w-4" />,
    children: [
      { title: "API Reference", href: "/docs/reference/api" },
      { title: "Configuration", href: "/docs/reference/configuration" },
      { title: "Error Codes", href: "/docs/reference/errors" },
    ],
  },
  {
    title: "Security",
    href: "/docs/security",
    icon: <Shield className="h-4 w-4" />,
    children: [
      { title: "Best Practices", href: "/docs/security/best-practices" },
      { title: "Encryption", href: "/docs/security/encryption" },
      { title: "Audit Logs", href: "/docs/security/audit" },
    ],
  },
  {
    title: "Deployment",
    href: "/docs/deployment",
    icon: <Server className="h-4 w-4" />,
    children: [
      { title: "Docker", href: "/docs/deployment/docker" },
      { title: "Kubernetes", href: "/docs/deployment/kubernetes" },
      { title: "Self-Hosted", href: "/docs/deployment/self-hosted" },
      { title: "Monitoring", href: "/docs/deployment/monitoring" },
    ],
  },
  {
    title: "Admin",
    href: "/docs/admin",
    icon: <Settings className="h-4 w-4" />,
    children: [
      { title: "Dashboard", href: "/docs/admin/dashboard" },
      { title: "User Management", href: "/docs/admin/users" },
      { title: "System Settings", href: "/docs/admin/settings" },
    ],
  },
  {
    title: "Contributing",
    href: "/docs/contributing",
    icon: <GitBranch className="h-4 w-4" />,
    children: [
      { title: "Style Guide", href: "/docs/contributing/style-guide" },
      { title: "Contribution Process", href: "/docs/contributing/process" },
    ],
  },
];

interface SidebarItemProps {
  item: NavItem;
  depth?: number;
  isActive?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

function SidebarItem({
  item,
  depth = 0,
  isActive,
  isExpanded,
  onToggle,
}: SidebarItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  const pathname = usePathname();

  const isItemActive =
    pathname === item.href ||
    (depth === 0 && pathname.startsWith(item.href + "/"));
  const isChildActive = item.children?.some((child) => pathname === child.href);

  return (
    <div>
      <Link
        href={item.href}
        className={cn(
          "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
          depth > 0 && "ml-6",
          isItemActive
            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50",
          isChildActive && depth === 0 && "font-medium",
        )}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggle?.();
            }}
            className="rounded p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            )}
          </button>
        )}
        {!hasChildren && depth === 0 && <span className="w-4" />}
        {item.icon && (
          <span
            className={cn("text-slate-400", isItemActive && "text-indigo-500")}
          >
            {item.icon}
          </span>
        )}
        <span className="flex-1">{item.title}</span>
        {item.badge && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            {item.badge}
          </span>
        )}
      </Link>
      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-0.5">
          {item.children!.map((child) => (
            <SidebarItem key={child.href} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(),
  );

  React.useEffect(() => {
    const saved = localStorage.getItem("docs-sidebar-expanded");
    if (saved) {
      try {
        setExpandedSections(new Set(JSON.parse(saved)));
      } catch {
        setExpandedSections(new Set(["/docs/getting-started", "/docs/sdk"]));
      }
    } else {
      setExpandedSections(new Set(["/docs/getting-started", "/docs/sdk"]));
    }
  }, []);

  const toggleSection = (href: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(href)) {
        next.delete(href);
      } else {
        next.add(href);
      }
      localStorage.setItem("docs-sidebar-expanded", JSON.stringify([...next]));
      return next;
    });
  };

  const isExpanded = (href: string) => expandedSections.has(href);

  return (
    <aside
      className={cn(
        "w-[280px] border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900",
        className,
      )}
    >
      <div className="h-[calc(100vh-64px)] overflow-y-auto p-3">
        <Link
          href="/docs/home"
          className={cn(
            "mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/docs/home"
              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50",
          )}
        >
          <Home className="h-4 w-4" />
          Documentation Home
        </Link>

        <div className="mt-3 border-t border-slate-200 dark:border-slate-800" />

        <nav className="mt-3 space-y-1">
          {NAVIGATION.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              isExpanded={isExpanded(item.href)}
              onToggle={() => toggleSection(item.href)}
            />
          ))}
        </nav>

        <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
          <a
            href="https://github.com/aether-identity/aether-identity"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50"
          >
            <GitBranch className="h-4 w-4" />
            View on GitHub
            <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
          </a>
          <a
            href="https://aether-identity.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50"
          >
            <FileText className="h-4 w-4" />
            Main Website
            <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
          </a>
        </div>
      </div>
    </aside>
  );
}
