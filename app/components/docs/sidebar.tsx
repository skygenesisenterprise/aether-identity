"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Rocket,
  Server,
  AppWindow,
  Package,
  Code2,
  ChevronRight,
  Database,
  Shield,
  Globe,
  Key,
  Lock,
  Webhook,
  Cloud,
  Container,
  Cpu,
  Terminal,
  FileCode,
  PlugZap,
  Blocks,
  Box,
  Workflow,
  Layers,
  Settings2,
  BookMarked,
  GraduationCap,
  LifeBuoy,
  MessageSquare,
  GitBranch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  items?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Getting Started",
    href: "/docs/getting-started",
    icon: Rocket,
  },
  {
    title: "Architecture",
    href: "/docs/architecture",
    icon: Blocks,
  },
  {
    title: "Server",
    href: "/docs/server",
    icon: Server,
    items: [
      { title: "Overview", href: "/docs/server/overview", icon: Server },
      { title: "Authentication", href: "/docs/server/authentication", icon: Lock },
      { title: "API Reference", href: "/docs/server/api-reference", icon: Code2 },
      { title: "Database", href: "/docs/server/database", icon: Database },
      { title: "Middleware", href: "/docs/server/middleware", icon: Layers },
    ],
  },
  {
    title: "Frontend App",
    href: "/docs/app",
    icon: AppWindow,
    items: [
      { title: "Overview", href: "/docs/app/overview", icon: AppWindow },
      { title: "Authentication", href: "/docs/app/authentication", icon: Key },
      { title: "Components", href: "/docs/app/components", icon: Box },
      { title: "Context & Hooks", href: "/docs/app/context", icon: Workflow },
      { title: "Routing", href: "/docs/app/routing", icon: Globe },
    ],
  },
  {
    title: "Packages SDK",
    href: "/docs/packages",
    icon: Package,
    items: [
      { title: "Node.js SDK", href: "/docs/packages/node", icon: Package },
      { title: "Go SDK", href: "/docs/packages/golang", icon: Terminal },
      { title: "GitHub App", href: "/docs/packages/github", icon: GitBranch },
      { title: "Docker", href: "/docs/packages/docker", icon: Container },
      { title: "Kubernetes", href: "/docs/packages/k8s", icon: Cloud },
    ],
  },
  {
    title: "API Reference",
    href: "/docs/api-reference",
    icon: BookOpen,
  },
  {
    title: "Deployment",
    href: "/docs/deployment",
    icon: Settings2,
    items: [
      { title: "Quick Start", href: "/docs/deployment/quick-start", icon: Rocket },
      { title: "Docker", href: "/docs/deployment/docker", icon: Container },
      { title: "Kubernetes", href: "/docs/deployment/kubernetes", icon: Cloud },
      { title: "Environment", href: "/docs/deployment/environment", icon: Settings2 },
    ],
  },
  {
    title: "Guides",
    href: "/docs/guides",
    icon: GraduationCap,
    items: [
      { title: "Authentication Flow", href: "/docs/guides/authentication", icon: Lock },
      { title: "OAuth & SSO", href: "/docs/guides/oauth", icon: Key },
      { title: "MFA Setup", href: "/docs/guides/mfa", icon: Shield },
      { title: "Webhooks", href: "/docs/guides/webhooks", icon: Webhook },
    ],
  },
  {
    title: "Resources",
    href: "/docs/resources",
    icon: BookMarked,
    items: [
      { title: "FAQ", href: "/docs/resources/faq", icon: MessageSquare },
      { title: "Troubleshooting", href: "/docs/resources/troubleshooting", icon: LifeBuoy },
      { title: "Changelog", href: "/docs/resources/changelog", icon: FileCode },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="py-4">
        <Link href="/docs" className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Aether Docs</span>
            <span className="text-xs text-muted-foreground">v1.0+</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                {item.items && item.items.length > 0 ? (
                  <CollapsibleMenuItem item={item} pathname={pathname} />
                ) : (
                  <SidebarMenuButton asChild isActive={isActiveGroup(pathname, item.href)}>
                    <Link href={item.href} className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <item.icon
                          className={cn("h-4 w-4", isActive(pathname, item.href) && "text-primary")}
                        />
                        <span
                          className={cn(
                            isActive(pathname, item.href) && "font-medium text-primary"
                          )}
                        >
                          {item.title}
                        </span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function CollapsibleMenuItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const isGroupActive = isActiveGroup(pathname, item.href);
  const [isOpen, setIsOpen] = React.useState(false);

  const hasActiveChild = React.useMemo(() => {
    if (!item.items) return false;
    return item.items.some((subItem) => isActive(pathname, subItem.href));
  }, [item.items, pathname]);

  React.useEffect(() => {
    if (isGroupActive || hasActiveChild) {
      setIsOpen(true);
    }
  }, [isGroupActive, hasActiveChild]);

  const hasSubItems = item.items && item.items.length > 0;

  return (
    <>
      {hasSubItems ? (
        <SidebarMenuButton asChild isActive={isGroupActive}>
          <button
            type="button"
            className="flex w-full items-center justify-between"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            <div className="flex items-center gap-2">
              <item.icon className={cn("h-4 w-4", isGroupActive && "text-primary")} />
              <span className={cn(isGroupActive && "font-medium text-primary")}>{item.title}</span>
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="h-4 w-4"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </button>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton asChild isActive={isGroupActive}>
          <Link href={item.href} className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <item.icon
                className={cn("h-4 w-4", isActive(pathname, item.href) && "text-primary")}
              />
              <span className={cn(isActive(pathname, item.href) && "font-medium text-primary")}>
                {item.title}
              </span>
            </div>
            {item.badge && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                {item.badge}
              </span>
            )}
          </Link>
        </SidebarMenuButton>
      )}
      <AnimatePresence>
        {isOpen && item.items && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.href}>
                  <SidebarMenuSubButton asChild isActive={isActive(pathname, subItem.href)}>
                    <Link href={subItem.href} className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <subItem.icon
                          className={cn(
                            "h-4 w-4",
                            isActive(pathname, subItem.href) && "text-primary"
                          )}
                        />
                        <span
                          className={cn(
                            isActive(pathname, subItem.href) && "text-primary font-medium"
                          )}
                        >
                          {subItem.title}
                        </span>
                      </div>
                      {subItem.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                          {subItem.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function isActive(pathname: string, href: string): boolean {
  return pathname === href;
}

function isActiveGroup(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
