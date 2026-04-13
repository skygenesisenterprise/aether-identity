"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { GitHubIcon } from "@/components/ui/icons/GitHubIcon";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocsHeaderProps {
  className?: string;
}

export function DocsHeader({ className }: DocsHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const versions = [
    { label: "v1.0+ (Latest)", value: "v1" },
    { label: "v0.9.x", value: "v0.9" },
  ];

  const currentVersion = "v1";

  return (
    <header
      className={cn("flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6", className)}
    >
      <div className="flex flex-1 items-center gap-4">
        <Link href="/docs" className="flex items-center gap-2">
          <span className="text-sm font-semibold">Documentation</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {versions.find((v) => v.value === currentVersion)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {versions.map((version) => (
                <DropdownMenuItem key={version.value}>{version.label}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className={cn("relative", searchOpen && "flex-1 md:flex-none md:w-64")}>
          {searchOpen ? (
            <div className="flex items-center gap-2 w-full">
              <Input
                type="search"
                placeholder="Search documentation..."
                className="w-full"
                autoFocus
              />
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hidden md:inline">
                ⌘K
              </span>
            </Button>
          )}
        </div>

        <Button variant="ghost" size="icon" asChild>
          <Link href="https://github.com/skygenesisenterprise/aether-identity" target="_blank">
            <GitHubIcon className="h-4 w-4" />
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
