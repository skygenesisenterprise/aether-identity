"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/dashboard/ui/badge";
import { cn } from "@/lib/utils";
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Menu,
  Building2,
  Layers,
  ChevronDown,
  UserCircle,
  Key,
  Check,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dashboard/ui/dropdown-menu";

export function Header() {
  const pathname = usePathname();

  // Lire les variables d'environnement pour la licence
  const envLicenseType = process.env.NEXT_PUBLIC_LICENSE_TYPE || "enterprise";
  const envLicenseKey = process.env.NEXT_PUBLIC_LICENSE_KEY || "ENTERPRISE-PROD-KEY-987654321";
  const envLicenseExpiration = process.env.NEXT_PUBLIC_LICENSE_EXPIRATION || "2025-12-31";

  // Déterminer le type de licence et le statut
  const licenseType = envLicenseType as "self-hosted" | "enterprise" | "premium" | "free" | "trial";
  const isEnterprise = licenseType === "enterprise";
  const isSelfHosted = licenseType === "self-hosted";
  
  // Vérifier si la licence est expirée
  let licenseStatus: "active" | "expired" | "invalid" | "grace_period" = "active";
  if (envLicenseExpiration) {
    try {
      const expirationDate = new Date(envLicenseExpiration);
      if (new Date() > expirationDate) {
        licenseStatus = "expired";
      }
    } catch (error) {
      console.error("Invalid expiration date format");
    }
  }

  // Valider la clé de licence
  if (!envLicenseKey) {
    licenseStatus = "invalid";
  } else if (envLicenseKey.startsWith("ENTERPRISE-") && !isEnterprise) {
    licenseStatus = "invalid";
  } else if (envLicenseKey.startsWith("SELF-") && !isSelfHosted) {
    licenseStatus = "invalid";
  }

  // Available options
  const authorities = [
    "Acme Corporation",
    "Global Authority",
    "Regional Authority",
  ];
  const workspaces = ["Production", "Development", "Staging"];

  // State for selections
  const [authority, setAuthority] = React.useState("Acme Corporation");
  const [workspace, setWorkspace] = React.useState("Production");
  const [environment, setEnvironment] = React.useState("EU-West");
  const [deploymentMode, setDeploymentMode] = React.useState<"self_hosted" | "saas">("self_hosted");
  const [plan, setPlan] = React.useState<"free" | "premium" | "enterprise" | "trial" | "self_hosted">("enterprise");
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">(
    "light",
  );

  const setThemeWithSystem = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    if (newTheme === "system") {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      document.documentElement.classList.toggle("dark", systemDark);
    } else {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  };

  // Context data (could be moved to context/state management)
  const contextData = {
    authority,
    workspace,
    environment,
    userRole: "Identity Admin",
    isPrivileged: true,
    deploymentMode,
    plan,
    licenseStatus,
  };

  const deploymentModeConfig = {
    self_hosted: {
      label: "Self-Hosted",
      color: "text-purple-500 border-purple-500/30 bg-purple-500/10",
    },
    saas: {
      label: "SaaS",
      color: "text-blue-500 border-blue-500/30 bg-blue-500/10",
    },
  };

  const planConfig = {
    free: {
      label: "Free",
      color: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
    },
    premium: {
      label: "Premium",
      color: "text-blue-500 border-blue-500/30 bg-blue-500/10",
    },
    enterprise: {
      label: "Enterprise",
      color: "text-orange-500 border-orange-500/30 bg-orange-500/10",
    },
    trial: {
      label: "Trial",
      color: "text-yellow-500 border-yellow-500/30 bg-yellow-500/10",
    },
    self_hosted: {
      label: "Self-Hosted",
      color: "text-purple-500 border-purple-500/30 bg-purple-500/10",
    },
  };

  const licenseStatusConfig = {
    active: {
      label: "Active",
      color: "text-green-500 border-green-500/30 bg-green-500/10",
    },
    expired: {
      label: "Expired",
      color: "text-red-500 border-red-500/30 bg-red-500/10",
    },
    invalid: {
      label: "Invalid",
      color: "text-yellow-500 border-yellow-500/30 bg-yellow-500/10",
    },
    grace_period: {
      label: "Grace Period",
      color: "text-orange-500 border-orange-500/30 bg-orange-500/10",
    },
  };

  return (
    <header className="flex h-16 w-full items-center gap-4 border-b bg-background px-6">
      {/* Mobile Menu Button */}
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      {/* Context Selectors */}
      <div className="hidden md:flex items-center gap-6">
        {/* Context Selectors */}
        <div className="flex items-center gap-1 text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground hover:text-foreground"
              >
                <Building2 className="h-3.5 w-3.5" />
                {contextData.authority}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {authorities.map((auth) => (
                <DropdownMenuItem
                  key={auth}
                  onClick={() => setAuthority(auth)}
                  className="cursor-pointer flex items-center justify-between"
                >
                  <span>{auth}</span>
                  {authority === auth && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-muted-foreground/50">/</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground hover:text-foreground"
              >
                <Layers className="h-3.5 w-3.5" />
                {contextData.workspace}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws}
                  onClick={() => setWorkspace(ws)}
                  className="cursor-pointer flex items-center justify-between"
                >
                  <span>{ws}</span>
                  {workspace === ws && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Badge variant="outline" className="ml-2 text-xs font-normal">
            {contextData.environment}
          </Badge>

          <Badge
            variant="outline"
            className={cn(
              "ml-2 text-xs font-normal",
              deploymentModeConfig[deploymentMode].color,
            )}
          >
            {deploymentModeConfig[deploymentMode].label}
          </Badge>

          <Badge
            variant="outline"
            className={cn("ml-2 text-xs font-normal", planConfig[plan].color)}
          >
            {planConfig[plan].label}
          </Badge>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Search className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96">
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  autoFocus
                />
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto py-2">
              <div className="px-2 pb-2 text-xs font-medium text-muted-foreground">
                Recent searches
              </div>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm">Security policies</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm">API keys</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm">User permissions</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-2 text-xs font-medium text-muted-foreground">
                Quick actions
              </div>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings" className="cursor-pointer gap-2">
                  <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm">Open settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/security/secrets"
                  className="cursor-pointer gap-2"
                >
                  <Key className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm">Manage API keys</span>
                </Link>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <div className="p-2 text-xs text-muted-foreground text-center">
              Press <kbd className="rounded border px-1 font-mono">⌘K</kbd> to
              search
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between p-2 border-b">
              <span className="text-sm font-medium">Notifications</span>
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                Mark all as read
              </Button>
            </div>
            <div className="max-h-80 overflow-y-auto py-2">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex items-center gap-2 w-full">
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm font-medium flex-1">
                    New policy update
                  </span>
                  <span className="text-xs text-muted-foreground">2m ago</span>
                </div>
                <span className="text-xs text-muted-foreground ml-4">
                  A new security policy has been applied to your workspace.
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex items-center gap-2 w-full">
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm font-medium flex-1">
                    API key expiring
                  </span>
                  <span className="text-xs text-muted-foreground">1h ago</span>
                </div>
                <span className="text-xs text-muted-foreground ml-4">
                  Your API key will expire in 3 days. Please renew it.
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex items-center gap-2 w-full">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30 shrink-0" />
                  <span className="text-sm font-medium flex-1">
                    User login detected
                  </span>
                  <span className="text-xs text-muted-foreground">3h ago</span>
                </div>
                <span className="text-xs text-muted-foreground ml-4">
                  New login from IP 192.168.1.100
                </span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/admin/notifications"
                className="cursor-pointer justify-center text-sm text-muted-foreground"
              >
                View all notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          asChild
        >
          <Link href="/docs/home">
            <HelpCircle className="h-4 w-4" />
          </Link>
        </Button>

        {/* Theme Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              {theme === "light" ? (
                <Sun className="h-4 w-4" />
              ) : theme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Monitor className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => setThemeWithSystem("light")}
              className="cursor-pointer flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                Light
              </span>
              {theme === "light" && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setThemeWithSystem("dark")}
              className="cursor-pointer flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Dark
              </span>
              {theme === "dark" && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setThemeWithSystem("system")}
              className="cursor-pointer flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                System
              </span>
              {theme === "system" && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Account Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 px-2 gap-2 text-muted-foreground hover:text-foreground"
            >
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="hidden sm:inline text-sm">Account</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Admin User</span>
                <span className="text-xs text-muted-foreground">
                  admin@company.com
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings/profile" className="cursor-pointer">
                <UserCircle className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/security/secrets" className="cursor-pointer">
                <Key className="mr-2 h-4 w-4" />
                API Keys
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/login"
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
