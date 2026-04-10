"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, User, LogIn, UserPlus, LogOut, Settings, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/locale-context";
import { locales, type Locale } from "@/lib/locale";

const categories = [
  { name: "À la une", href: "/" },
  { name: "Politique", href: "/politique" },
  { name: "Économie", href: "/economie" },
  { name: "Monde", href: "/monde" },
  { name: "Culture", href: "/culture" },
  { name: "Sport", href: "/sport" },
  { name: "Espace", href: "/espace" },
  { name: "Jeu Vidéo", href: "/video-game" },
  { name: "Informatique", href: "/informatique" },
  { name: "Société", href: "/societe" },
  { name: "Environnement", href: "/environnement" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale } = useLocale();

  const getLocaleHref = (href: string) => {
    if (href === "/") return `/${locale}`;
    return `/${locale}${href}`;
  };
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <span className="text-xs text-muted-foreground hidden md:block capitalize">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <Link
            href={`/${locale}`}
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
          >
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground whitespace-nowrap">
              The Etheria Times
            </h1>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Rechercher</span>
            </Button>

            {/* Locale Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">Changer de pays</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {locales.map((locale) => (
                  <DropdownMenuItem key={locale.code} asChild>
                    <Link href={`/${locale.code}`} className="flex items-center gap-2">
                      <span>{locale.flag}</span>
                      <span>{locale.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Account Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex">
                  <User className="h-4 w-4" />
                  <span className="sr-only">Mon compte</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-2 py-1.5 border-b">
                      <p className="text-sm font-medium truncate">{user.name || user.email}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/user" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Mon compte
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/user/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Paramètres
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="flex items-center">
                        <LogIn className="mr-2 h-4 w-4" />
                        Connexion
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register" className="flex items-center">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Créer un compte
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Subscribe Button - hide for admin users */}
            {!(isAuthenticated && user?.email?.toLowerCase().endsWith("@etheriatimes.com")) && (
              <Link href={getLocaleHref("/abonnement")}>
                <Button className="bg-red-600 hover:bg-red-700 text-white h-8 px-3 text-sm hidden sm:flex">
                  S'abonner
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-b border-border bg-background">
            <div className="mx-auto max-w-7xl px-4 py-3">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                />
                <button type="submit" className="text-sm text-primary hover:underline">
                  Rechercher
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Fermer
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Desktop navigation */}
      <nav className="hidden lg:block bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="flex items-center justify-center">
            {categories.map((category, index) => (
              <li key={category.name}>
                <Link
                  href={getLocaleHref(category.href)}
                  className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                    index === 0
                      ? "text-primary font-semibold"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav className="lg:hidden border-b border-border bg-background">
          <ul className="px-4 py-2">
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  href={getLocaleHref(category.href)}
                  className="block px-2 py-3 text-sm font-medium text-foreground hover:text-primary transition-colors border-b border-border last:border-b-0"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
