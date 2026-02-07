"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Menu,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();

  // Generate breadcrumb from pathname
  const breadcrumbItems = React.useMemo(() => {
    const parts = pathname.replace("/admin/", "").split("/");
    return parts.map((part, index) => {
      const href = "/admin/" + parts.slice(0, index + 1).join("/");
      const label =
        part.charAt(0).toUpperCase() + part.slice(1).replace(/_/g, " ");
      return { label, href, isLast: index === parts.length - 1 };
    });
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      {/* Mobile Menu Button */}
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      {/* Breadcrumb */}
      <nav className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/admin/home"
          className="hover:text-foreground transition-colors"
        >
          Admin
        </Link>
        {breadcrumbItems.length > 0 && (
          <>
            <span>/</span>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={item.href}>
                {index > 0 && <span>/</span>}
                {item.isLast ? (
                  <span className="font-medium text-foreground">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </>
        )}
      </nav>

      {/* Right Side Actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications */}
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

        {/* Help */}
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <HelpCircle className="h-4 w-4" />
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          asChild
        >
          <Link href="/admin/settings">
            <Settings className="h-4 w-4" />
          </Link>
        </Button>

        {/* User Profile */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-full"
        >
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        </Button>

        {/* Logout */}
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
