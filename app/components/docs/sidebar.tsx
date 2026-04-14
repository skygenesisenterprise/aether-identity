"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Rocket,
  Server,
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
  Terminal,
  FileCode,
  Blocks,
  Workflow,
  Settings2,
  GraduationCap,
  LifeBuoy,
  MessageSquare,
  GitBranch,
  Plug,
  Link2,
  Users,
  Fingerprint,
  Clock,
  FileText,
  Building2,
  Network,
  ExternalLink,
  PlugZap,
  Gauge,
  ScrollText,
  Handshake,
  Wallet,
  Palette,
  Laptop,
  Smartphone,
  Globe2,
  MapPin,
  FolderCog,
  Bug,
  Lightbulb,
  Download,
  RefreshCw,
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
    title: "How it Works",
    href: "/docs/about/how-it-works",
    icon: Lightbulb,
  },
  {
    title: "Comparison",
    href: "/docs/about/comparison",
    icon: GitBranch,
  },
  {
    title: "Quick Install",
    href: "/docs/deployment/quick-install",
    icon: Rocket,
  },
  {
    title: "System Architecture",
    href: "/docs/development/architecture",
    icon: Blocks,
    items: [
      { title: "Overview", href: "/docs/development/architecture", icon: Blocks },
      { title: "API Reference", href: "/docs/development/api-reference", icon: Code2 },
      { title: "Database", href: "/docs/development/database", icon: Database },
    ],
  },
  {
    title: "Contributing",
    href: "/docs/development/contributing",
    icon: GitBranch,
    items: [
      { title: "Getting Started", href: "/docs/development/contributing", icon: Rocket },
      { title: "Feature Requests", href: "/docs/development/feature-requests", icon: Lightbulb },
    ],
  },
  {
    title: "Access Control",
    href: "/docs/guides/access-control",
    icon: Shield,
    items: [
      { title: "Users & Roles", href: "/docs/guides/users-roles", icon: Users },
      { title: "Authentication", href: "/docs/guides/authentication", icon: Fingerprint },
      { title: "MFA", href: "/docs/guides/mfa", icon: Shield },
      { title: "Password", href: "/docs/guides/password", icon: Key },
      { title: "Rules", href: "/docs/guides/rules", icon: FileText },
      { title: "Session Length", href: "/docs/guides/session", icon: Clock },
    ],
  },
  {
    title: "Clients",
    href: "/docs/guides/clients",
    icon: Laptop,
    items: [
      { title: "Install", href: "/docs/guides/clients-install", icon: Download },
      { title: "Configure", href: "/docs/guides/clients-configure", icon: Settings2 },
      { title: "Update", href: "/docs/guides/clients-update", icon: RefreshCw },
      { title: "Fingerprinting", href: "/docs/guides/clients-fingerprint", icon: Fingerprint },
    ],
  },
  {
    title: "Resources",
    href: "/docs/guides/resources",
    icon: Link2,
    items: [
      { title: "Overview", href: "/docs/guides/resources", icon: Link2 },
      { title: "Private Resources", href: "/docs/guides/resources-private", icon: Lock },
      { title: "Public Resources", href: "/docs/guides/resources-public", icon: Globe },
      { title: "Health Checks", href: "/docs/guides/healthchecks", icon: Gauge },
    ],
  },
  {
    title: "Deployment",
    href: "/docs/deployment",
    icon: Server,
    items: [
      { title: "Quick Install", href: "/docs/deployment/quick-install", icon: Rocket },
      { title: "Docker", href: "/docs/deployment/docker", icon: Container },
      { title: "Kubernetes", href: "/docs/deployment/kubernetes", icon: Cloud },
      { title: "Environment", href: "/docs/deployment/environment", icon: Settings2 },
    ],
  },
  {
    title: "Configuration",
    href: "/docs/guides/configuration",
    icon: Settings2,
    items: [
      { title: "Config File", href: "/docs/guides/config-file", icon: FileText },
      { title: "Branding", href: "/docs/guides/branding", icon: Palette },
      { title: "Domains", href: "/docs/guides/domains", icon: Globe2 },
    ],
  },
  {
    title: "Identity Providers",
    href: "/docs/guides/identity-providers",
    icon: Handshake,
    items: [
      { title: "Overview", href: "/docs/guides/identity-providers", icon: Handshake },
      { title: "OAuth2/OIDC", href: "/docs/guides/oidc", icon: Key },
      { title: "Google", href: "/docs/guides/google", icon: Globe },
      { title: "Azure", href: "/docs/guides/azure", icon: Building2 },
    ],
  },
  {
    title: "Resources",
    href: "/docs/resources",
    icon: MessageSquare,
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
            <span className="text-sm font-semibold">Aether Identity Docs</span>
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
