"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const publicRoutes = ["/login", "/register", "/forgot", "/oauth"];

const shouldShowSidebar = (pathname: string): boolean => {
  // Ne pas afficher la sidebar sur les pages d'authentification publiques
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return false;
  }

  // Ne pas afficher la sidebar sur la page racine (redirection)
  if (pathname === "/") {
    return false;
  }

  // Afficher la sidebar partout ailleurs (home, dashboard, account, etc.)
  return true;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const showSidebar = shouldShowSidebar(pathname);

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
