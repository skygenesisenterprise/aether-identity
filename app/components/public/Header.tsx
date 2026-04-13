"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Shield,
  Users,
  Key,
  Lock,
  Layers,
  Code,
  BookOpen,
  FileText,
  Zap,
  Building2,
  Smartphone,
  Globe,
  Server,
  Database,
  Settings,
  LifeBuoy,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href?: string;
  description?: string;
  icon?: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface MegaMenu {
  sections: NavSection[];
  featured?: {
    title: string;
    description: string;
    href: string;
    badge?: string;
  };
}

const productMenuData: MenuData = {
  sectionTitles: ["corePlatform", "enterprise"],
  items: [
    [
      {
        titleKey: "universalLogin",
        descKey: "universalLoginDesc",
        href: "/products/universal-login",
        icon: <Lock className="h-5 w-5" />,
      },
      {
        titleKey: "singleSignOn",
        descKey: "singleSignOnDesc",
        href: "/products/sso",
        icon: <Key className="h-5 w-5" />,
      },
      {
        titleKey: "multiFactorAuth",
        descKey: "multiFactorAuthDesc",
        href: "/products/mfa",
        icon: <Shield className="h-5 w-5" />,
      },
      {
        titleKey: "userManagement",
        descKey: "userManagementDesc",
        href: "/products/user-management",
        icon: <Users className="h-5 w-5" />,
      },
    ],
    [
      {
        titleKey: "enterpriseConnections",
        descKey: "enterpriseConnectionsDesc",
        href: "/products/enterprise",
        icon: <Building2 className="h-5 w-5" />,
      },
      {
        titleKey: "organizations",
        descKey: "organizationsDesc",
        href: "/products/organizations",
        icon: <Layers className="h-5 w-5" />,
      },
      {
        titleKey: "fineGrainedAuthorization",
        descKey: "fineGrainedAuthorizationDesc",
        href: "/products/fga",
        icon: <Settings className="h-5 w-5" />,
      },
      {
        titleKey: "privateCloud",
        descKey: "privateCloudDesc",
        href: "/products/private-cloud",
        icon: <Server className="h-5 w-5" />,
      },
    ],
  ],
  featured: {
    titleKey: "aiAgents",
    descKey: "aiAgentsDesc",
    href: "/products/ai-agents",
    badgeKey: "new",
  },
};

const developersMenuData: MenuData = {
  sectionTitles: ["resources", "tools"],
  items: [
    [
      {
        titleKey: "documentation",
        descKey: "documentationDesc",
        href: "/developers",
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        titleKey: "quickstarts",
        descKey: "quickstartsDesc",
        href: "/developers/quickstarts",
        icon: <Zap className="h-5 w-5" />,
      },
      {
        titleKey: "apiReference",
        descKey: "apiReferenceDesc",
        href: "/developers/api",
        icon: <Code className="h-5 w-5" />,
      },
      {
        titleKey: "sdksLibraries",
        descKey: "sdksLibrariesDesc",
        href: "/developers/sdks",
        icon: <Layers className="h-5 w-5" />,
      },
    ],
    [
      {
        titleKey: "cli",
        descKey: "cliDesc",
        href: "/developers/cli",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        titleKey: "postman",
        descKey: "postmanDesc",
        href: "/developers/postman",
        icon: <Database className="h-5 w-5" />,
      },
      {
        titleKey: "extensions",
        descKey: "extensionsDesc",
        href: "/developers/extensions",
        icon: <Settings className="h-5 w-5" />,
      },
      {
        titleKey: "community",
        descKey: "communityDesc",
        href: "/community",
        icon: <Users className="h-5 w-5" />,
      },
    ],
  ],
};

const solutionsMenuData: MenuData = {
  sectionTitles: ["byUseCase", "byIndustry"],
  items: [
    [
      {
        titleKey: "b2cIdentity",
        descKey: "b2cIdentityDesc",
        href: "/solutions/b2c",
        icon: <Smartphone className="h-5 w-5" />,
      },
      {
        titleKey: "b2bSaas",
        descKey: "b2bSaasDesc",
        href: "/solutions/b2b",
        icon: <Building2 className="h-5 w-5" />,
      },
      {
        titleKey: "machineToMachine",
        descKey: "machineToMachineDesc",
        href: "/solutions/m2m",
        icon: <Server className="h-5 w-5" />,
      },
      {
        titleKey: "passwordless",
        descKey: "passwordlessDesc",
        href: "/solutions/passwordless",
        icon: <Key className="h-5 w-5" />,
      },
    ],
    [
      {
        titleKey: "financialServices",
        descKey: "financialServicesDesc",
        href: "/solutions/financial",
        icon: <Shield className="h-5 w-5" />,
      },
      {
        titleKey: "healthcare",
        descKey: "healthcareDesc",
        href: "/solutions/healthcare",
        icon: <LifeBuoy className="h-5 w-5" />,
      },
      {
        titleKey: "retailEcommerce",
        descKey: "retailEcommerceDesc",
        href: "/solutions/retail",
        icon: <Globe className="h-5 w-5" />,
      },
      {
        titleKey: "publicSector",
        descKey: "publicSectorDesc",
        href: "/solutions/government",
        icon: <Building2 className="h-5 w-5" />,
      },
    ],
  ],
};

type MenuData = {
  sectionTitles: string[];
  items: { titleKey: string; descKey: string; href: string; icon: React.ReactNode }[][];
  featured?: { titleKey: string; descKey: string; href: string; badgeKey?: string };
};

function MegaMenuDropdown({
  sectionTitles,
  items,
  featured,
  isOpen,
}: {
  sectionTitles: string[];
  items: { titleKey: string; descKey: string; href: string; icon: React.ReactNode }[][];
  featured?: { titleKey: string; descKey: string; href: string; badgeKey?: string };
  isOpen: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("Header");

  const getLocaleHref = (href: string) => {
    if (href === "/") return `/${locale}`;
    return `/${locale}${href}`;
  };

  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 top-full pt-4 transition-all duration-200",
        isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
      )}
    >
      <div className="bg-background border border-border rounded-xl shadow-xl overflow-hidden min-w-170">
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="grid grid-cols-2 gap-8">
              {sectionTitles.map((title, sectionIdx) => (
                <div key={title}>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    {t(title)}
                  </h3>
                  <ul className="space-y-1">
                    {items[sectionIdx].map((item) => (
                      <li key={item.titleKey}>
                        <Link
                          href={getLocaleHref(item.href)}
                          className="group flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <span className="shrink-0 mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors">
                            {item.icon}
                          </span>
                          <div>
                            <span className="block text-sm font-medium text-foreground group-hover:text-foreground">
                              {t(item.titleKey)}
                            </span>
                            <span className="block text-xs text-muted-foreground mt-0.5">
                              {t(item.descKey)}
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {featured && (
            <div className="w-72 bg-muted/50 p-6 border-l border-border">
              <div className="flex items-center gap-2 mb-3">
                {featured.badgeKey && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-foreground text-background px-2 py-0.5 rounded-full">
                    {t(featured.badgeKey)}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-2">{t(featured.titleKey)}</h4>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                {t(featured.descKey)}
              </p>
              <Link
                href={getLocaleHref(featured.href)}
                className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
              >
                {t("learnMore")}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LanguageSwitcherDropdown() {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Header");
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
  ];

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <Languages className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLang.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={cn(
                "w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-muted transition-colors",
                locale === lang.code && "bg-muted font-medium text-foreground"
              )}
              onClick={() => handleLocaleChange(lang.code)}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileMenuContent({ menuData }: { menuData: MenuData }) {
  const locale = useLocale();
  const t = useTranslations("Header");

  const getLocaleHref = (href: string) => {
    if (href === "/") return `/${locale}`;
    return `/${locale}${href}`;
  };

  return (
    <div className="pl-4 space-y-1 mt-1">
      {menuData.sectionTitles.map((sectionTitle, sectionIdx) => (
        <div key={sectionTitle} className="py-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t(sectionTitle)}
          </span>
          <div className="mt-2 space-y-1">
            {menuData.items[sectionIdx].map((item) => (
              <Link
                key={item.titleKey}
                href={getLocaleHref(item.href)}
                className="block py-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                {t(item.titleKey)}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const locale = useLocale();
  const { isAuthenticated } = useAuth();
  const t = useTranslations("Header");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLocaleHref = (href: string) => {
    if (href === "/") return `/${locale}`;
    return `/${locale}${href}`;
  };

  const navItems = [
    { name: t("product"), menuData: productMenuData },
    { name: t("solutions"), menuData: solutionsMenuData },
    { name: t("developers"), menuData: developersMenuData },
    { name: t("pricing"), href: "/pricing" },
    { name: t("blog"), href: "/blog" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-200",
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-background border-b border-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
              <div className="relative">
                <Shield className="h-7 w-7 text-foreground transition-transform group-hover:scale-105" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-base text-foreground leading-tight">
                  Aether Identity
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight tracking-wide">
                  {t("bySkyGenesis")}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.menuData && setActiveMenu(item.name)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {item.href ? (
                    <Link
                      href={getLocaleHref(item.href)}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
                        activeMenu === item.name
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.name}
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200",
                          activeMenu === item.name && "rotate-180"
                        )}
                      />
                    </button>
                  )}
                  {item.menuData && (
                    <MegaMenuDropdown
                      sectionTitles={item.menuData.sectionTitles}
                      items={item.menuData.items}
                      featured={item.menuData.featured}
                      isOpen={activeMenu === item.name}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <Link
              href={getLocaleHref("/contact")}
              className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("contactSales")}
            </Link>

            <LanguageSwitcherDropdown />

            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="sm" className="h-9 px-4 font-medium">
                  {t("dashboard")}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-4 font-medium text-muted-foreground hover:text-foreground"
                  >
                    {t("login")}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="h-9 px-4 font-medium">
                    {t("signUp")}
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.href ? (
                  <Link
                    href={getLocaleHref(item.href)}
                    className="block py-2 text-base font-medium text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <div>
                    <span className="block py-2 text-base font-medium text-foreground">
                      {item.name}
                    </span>
                    {item.menuData && <MobileMenuContent menuData={item.menuData} />}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 border-t border-border space-y-3">
              <Link
                href={getLocaleHref("/contact")}
                className="block text-sm font-medium text-muted-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("contactSales")}
              </Link>
              {!isAuthenticated && (
                <div className="flex gap-3">
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full">
                      {t("login")}
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full">{t("signUp")}</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
