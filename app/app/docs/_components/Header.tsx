"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Moon,
  Sun,
  Github,
  Menu,
  ChevronDown,
  FileText,
  BookOpen,
  Box,
  Globe,
  Zap,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const NAVIGATION_ITEMS = [
  { label: "Guide", href: "/docs/getting-started" },
  { label: "API Reference", href: "/docs/reference/api" },
  { label: "SDK", href: "/docs/sdk/core" },
];

const VERSIONS = ["v2.0 (Latest)", "v1.x", "v0.x"];

const SEARCH_INDEX = [
  {
    title: "Quick Start",
    href: "/docs/getting-started/quick-start",
    category: "Getting Started",
  },
  {
    title: "Installation",
    href: "/docs/getting-started/installation",
    category: "Getting Started",
  },
  {
    title: "Configuration",
    href: "/docs/getting-started/configuration",
    category: "Getting Started",
  },
  {
    title: "Architecture",
    href: "/docs/concepts/architecture",
    category: "Concepts",
  },
  {
    title: "Identity Model",
    href: "/docs/concepts/identity-model",
    category: "Concepts",
  },
  {
    title: "Authentication",
    href: "/docs/concepts/authentication",
    category: "Concepts",
  },
  {
    title: "Authorization",
    href: "/docs/concepts/authorization",
    category: "Concepts",
  },
  { title: "Core SDK", href: "/docs/sdk/core", category: "SDK" },
  { title: "Runtime", href: "/docs/sdk/runtime", category: "SDK" },
  { title: "Extensions", href: "/docs/sdk/extensions", category: "SDK" },
  { title: "CLI & Tools", href: "/docs/sdk/tools", category: "SDK" },
  {
    title: "API Reference",
    href: "/docs/reference/api",
    category: "Reference",
  },
  {
    title: "Integrations",
    href: "/docs/integrations",
    category: "Integrations",
  },
  { title: "Deployment", href: "/docs/deployment", category: "Deployment" },
  { title: "Security", href: "/docs/security", category: "Security" },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Getting Started": <Zap className="w-4 h-4" />,
  Concepts: <BookOpen className="w-4 h-4" />,
  SDK: <Box className="w-4 h-4" />,
  Reference: <FileText className="w-4 h-4" />,
  Integrations: <Globe className="w-4 h-4" />,
  Deployment: <Github className="w-4 h-4" />,
  Security: <Github className="w-4 h-4" />,
};

export function Header({ className }: HeaderProps) {
  const [isDark, setIsDark] = React.useState(false);
  const [isVersionOpen, setIsVersionOpen] = React.useState(false);
  const [selectedVersion, setSelectedVersion] = React.useState(VERSIONS[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const searchRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("docs-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("docs-theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  const handleVersionSelect = (version: string) => {
    setSelectedVersion(version);
    setIsVersionOpen(false);
  };

  const filteredResults = React.useMemo(() => {
    if (!searchQuery.trim()) return SEARCH_INDEX;
    const query = searchQuery.toLowerCase();
    return SEARCH_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80",
        className,
      )}
    >
      <div className="flex items-center gap-8">
        <Link href="/docs/home" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <span className="font-bold text-lg">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">
              Aether Identity
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Documentation
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAVIGATION_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://github.com/aether-identity/aether-identity"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-3" ref={searchRef}>
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search docs..."
              className="h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />
            <kbd className="absolute right-3 hidden rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400 lg:inline-block">
              ⌘K
            </kbd>
          </div>

          {isSearchOpen &&
            (searchQuery.trim() || filteredResults.length > 0) && (
              <div className="absolute top-full right-0 z-50 mt-2 w-96 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
                {filteredResults.length === 0 ? (
                  <div className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    <p>No results found for &quot;{searchQuery}&quot;</p>
                  </div>
                ) : (
                  <>
                    {searchQuery.trim() && (
                      <div className="border-b border-slate-100 px-4 py-2 dark:border-slate-700">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {filteredResults.length} result
                          {filteredResults.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    )}
                    <div className="max-h-96 overflow-y-auto py-2">
                      {filteredResults.map((result) => (
                        <Link
                          key={result.href}
                          href={result.href}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                            {CATEGORY_ICONS[result.category] || (
                              <FileText className="w-4 h-4" />
                            )}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium">{result.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {result.category}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                        </Link>
                      ))}
                    </div>
                  </>
                )}
                <div className="border-t border-slate-100 px-4 py-2 dark:border-slate-700">
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-medium dark:bg-slate-700">
                      ↑↓
                    </kbd>{" "}
                    to navigate,{" "}
                    <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-medium dark:bg-slate-700">
                      ⌲
                    </kbd>{" "}
                    to select
                  </p>
                </div>
              </div>
            )}
        </div>

        <div className="relative">
          <button
            onClick={() => setIsVersionOpen(!isVersionOpen)}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <span>{selectedVersion.split(" ")[0]}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {isVersionOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsVersionOpen(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                {VERSIONS.map((version) => (
                  <button
                    key={version}
                    onClick={() => handleVersionSelect(version)}
                    className={cn(
                      "w-full px-3 py-1.5 text-left text-sm transition-colors",
                      version === selectedVersion
                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700",
                    )}
                  >
                    {version}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 md:hidden dark:border-slate-700 dark:text-slate-400"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full border-b border-slate-200 bg-white px-6 py-4 md:hidden dark:border-slate-700 dark:bg-slate-900">
          <nav className="flex flex-col gap-2">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://github.com/aether-identity/aether-identity"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
