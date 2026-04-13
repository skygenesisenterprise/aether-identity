"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/locale-context";
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

const productMenuEN: MegaMenu = {
  sections: [
    {
      title: "Core Platform",
      items: [
        {
          name: "Universal Login",
          href: "/products/universal-login",
          description: "Customizable, secure authentication",
          icon: <Lock className="h-5 w-5" />,
        },
        {
          name: "Single Sign-On",
          href: "/products/sso",
          description: "One login for all applications",
          icon: <Key className="h-5 w-5" />,
        },
        {
          name: "Multi-Factor Auth",
          href: "/products/mfa",
          description: "Adaptive, risk-based MFA",
          icon: <Shield className="h-5 w-5" />,
        },
        {
          name: "User Management",
          href: "/products/user-management",
          description: "Complete identity lifecycle",
          icon: <Users className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Enterprise",
      items: [
        {
          name: "Enterprise Connections",
          href: "/products/enterprise",
          description: "SAML, LDAP, Active Directory",
          icon: <Building2 className="h-5 w-5" />,
        },
        {
          name: "Organizations",
          href: "/products/organizations",
          description: "Multi-tenant B2B solutions",
          icon: <Layers className="h-5 w-5" />,
        },
        {
          name: "Fine-Grained Authorization",
          href: "/products/fga",
          description: "Relationship-based access control",
          icon: <Settings className="h-5 w-5" />,
        },
        {
          name: "Private Cloud",
          href: "/products/private-cloud",
          description: "Dedicated infrastructure",
          icon: <Server className="h-5 w-5" />,
        },
      ],
    },
  ],
  featured: {
    title: "Aether Identity for AI Agents",
    description:
      "Secure authentication and authorization for AI-powered applications and autonomous agents.",
    href: "/products/ai-agents",
    badge: "New",
  },
};

const developersMenuEN: MegaMenu = {
  sections: [
    {
      title: "Resources",
      items: [
        {
          name: "Documentation",
          href: "/developers",
          description: "Guides and API references",
          icon: <BookOpen className="h-5 w-5" />,
        },
        {
          name: "Quickstarts",
          href: "/developers/quickstarts",
          description: "Get started in minutes",
          icon: <Zap className="h-5 w-5" />,
        },
        {
          name: "API Reference",
          href: "/developers/api",
          description: "Complete API documentation",
          icon: <Code className="h-5 w-5" />,
        },
        {
          name: "SDKs & Libraries",
          href: "/developers/sdks",
          description: "Official client libraries",
          icon: <Layers className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Tools",
      items: [
        {
          name: "CLI",
          href: "/developers/cli",
          description: "Command-line interface",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          name: "Postman Collections",
          href: "/developers/postman",
          description: "API testing collections",
          icon: <Database className="h-5 w-5" />,
        },
        {
          name: "Extensions",
          href: "/developers/extensions",
          description: "Extend functionality",
          icon: <Settings className="h-5 w-5" />,
        },
        {
          name: "Community",
          href: "/community",
          description: "Join the discussion",
          icon: <Users className="h-5 w-5" />,
        },
      ],
    },
  ],
};

const solutionsMenuEN: MegaMenu = {
  sections: [
    {
      title: "By Use Case",
      items: [
        {
          name: "B2C Identity",
          href: "/solutions/b2c",
          description: "Consumer-facing applications",
          icon: <Smartphone className="h-5 w-5" />,
        },
        {
          name: "B2B SaaS",
          href: "/solutions/b2b",
          description: "Multi-tenant enterprise apps",
          icon: <Building2 className="h-5 w-5" />,
        },
        {
          name: "Machine-to-Machine",
          href: "/solutions/m2m",
          description: "API & service authentication",
          icon: <Server className="h-5 w-5" />,
        },
        {
          name: "Passwordless",
          href: "/solutions/passwordless",
          description: "Friction-free authentication",
          icon: <Key className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "By Industry",
      items: [
        {
          name: "Financial Services",
          href: "/solutions/financial",
          description: "Banking & fintech solutions",
          icon: <Shield className="h-5 w-5" />,
        },
        {
          name: "Healthcare",
          href: "/solutions/healthcare",
          description: "HIPAA-compliant identity",
          icon: <LifeBuoy className="h-5 w-5" />,
        },
        {
          name: "Retail & E-commerce",
          href: "/solutions/retail",
          description: "Customer identity at scale",
          icon: <Globe className="h-5 w-5" />,
        },
        {
          name: "Public Sector",
          href: "/solutions/government",
          description: "Secure government services",
          icon: <Building2 className="h-5 w-5" />,
        },
      ],
    },
  ],
};

const productMenuFR: MegaMenu = {
  sections: [
    {
      title: "Plateforme Principale",
      items: [
        {
          name: "Connexion Universelle",
          href: "/products/universal-login",
          description: "Authentification sécurisée personnalisable",
          icon: <Lock className="h-5 w-5" />,
        },
        {
          name: "Authentification Unique",
          href: "/products/sso",
          description: "Une connexion pour toutes les applications",
          icon: <Key className="h-5 w-5" />,
        },
        {
          name: "Authentification Multi-Facteurs",
          href: "/products/mfa",
          description: "AMF adaptative basée sur les risques",
          icon: <Shield className="h-5 w-5" />,
        },
        {
          name: "Gestion des Utilisateurs",
          href: "/products/user-management",
          description: "Cycle de vie complet de l'identité",
          icon: <Users className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Entreprise",
      items: [
        {
          name: "Connexions Entreprise",
          href: "/products/enterprise",
          description: "SAML, LDAP, Active Directory",
          icon: <Building2 className="h-5 w-5" />,
        },
        {
          name: "Organisations",
          href: "/products/organizations",
          description: "Solutions B2B multi-tenant",
          icon: <Layers className="h-5 w-5" />,
        },
        {
          name: "Autorisation Fine",
          href: "/products/fga",
          description: "Contrôle d'accès basé sur les relations",
          icon: <Settings className="h-5 w-5" />,
        },
        {
          name: "Cloud Privé",
          href: "/products/private-cloud",
          description: "Infrastructure dédiée",
          icon: <Server className="h-5 w-5" />,
        },
      ],
    },
  ],
  featured: {
    title: "Aether Identity pour Agents IA",
    description:
      "Authentification et autorisation sécurisées pour les applications alimentées par l'IA et les agents autonomes.",
    href: "/products/ai-agents",
    badge: "Nouveau",
  },
};

const developersMenuFR: MegaMenu = {
  sections: [
    {
      title: "Ressources",
      items: [
        {
          name: "Documentation",
          href: "/developers",
          description: "Guides et références API",
          icon: <BookOpen className="h-5 w-5" />,
        },
        {
          name: "Démarrages Rapides",
          href: "/developers/quickstarts",
          description: "Commencez en quelques minutes",
          icon: <Zap className="h-5 w-5" />,
        },
        {
          name: "Référence API",
          href: "/developers/api",
          description: "Documentation API complète",
          icon: <Code className="h-5 w-5" />,
        },
        {
          name: "SDKs et Bibliothèques",
          href: "/developers/sdks",
          description: "Bibliothèques clientes officielles",
          icon: <Layers className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Outils",
      items: [
        {
          name: "CLI",
          href: "/developers/cli",
          description: "Interface en ligne de commande",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          name: "Collections Postman",
          href: "/developers/postman",
          description: "Collections de test API",
          icon: <Database className="h-5 w-5" />,
        },
        {
          name: "Extensions",
          href: "/developers/extensions",
          description: "Étendre les fonctionnalités",
          icon: <Settings className="h-5 w-5" />,
        },
        {
          name: "Communauté",
          href: "/community",
          description: "Rejoignez la discussion",
          icon: <Users className="h-5 w-5" />,
        },
      ],
    },
  ],
};

const solutionsMenuFR: MegaMenu = {
  sections: [
    {
      title: "Par Cas d'Usage",
      items: [
        {
          name: "Identité B2C",
          href: "/solutions/b2c",
          description: "Applications grand public",
          icon: <Smartphone className="h-5 w-5" />,
        },
        {
          name: "B2B SaaS",
          href: "/solutions/b2b",
          description: "Applications entreprise multi-tenant",
          icon: <Building2 className="h-5 w-5" />,
        },
        {
          name: "Machine à Machine",
          href: "/solutions/m2m",
          description: "Authentification API et service",
          icon: <Server className="h-5 w-5" />,
        },
        {
          name: "Sans Mot de Passe",
          href: "/solutions/passwordless",
          description: "Authentification sans friction",
          icon: <Key className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Par Industrie",
      items: [
        {
          name: "Services Financiers",
          href: "/solutions/financial",
          description: "Solutions bancaires et fintech",
          icon: <Shield className="h-5 w-5" />,
        },
        {
          name: "Santé",
          href: "/solutions/healthcare",
          description: "Identité conforme HIPAA",
          icon: <LifeBuoy className="h-5 w-5" />,
        },
        {
          name: "Retail et E-commerce",
          href: "/solutions/retail",
          description: "Identité client à grande échelle",
          icon: <Globe className="h-5 w-5" />,
        },
        {
          name: "Secteur Public",
          href: "/solutions/government",
          description: "Services gouvernementaux sécurisés",
          icon: <Building2 className="h-5 w-5" />,
        },
      ],
    },
  ],
};

function MegaMenuDropdown({
  menu,
  isOpen,
  labels,
}: {
  menu: MegaMenu;
  isOpen: boolean;
  labels?: { learnMore?: string };
}) {
  const { locale } = useLocale();

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
              {menu.sections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={getLocaleHref(item.href || "/")}
                          className="group flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <span className="shrink-0 mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors">
                            {item.icon}
                          </span>
                          <div>
                            <span className="block text-sm font-medium text-foreground group-hover:text-foreground">
                              {item.name}
                            </span>
                            <span className="block text-xs text-muted-foreground mt-0.5">
                              {item.description}
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

          {menu.featured && (
            <div className="w-72 bg-muted/50 p-6 border-l border-border">
              <div className="flex items-center gap-2 mb-3">
                {menu.featured.badge && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-foreground text-background px-2 py-0.5 rounded-full">
                    {menu.featured.badge}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-2">{menu.featured.title}</h4>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                {menu.featured.description}
              </p>
              <Link
                href={getLocaleHref(menu.featured.href)}
                className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
              >
                {labels?.learnMore || "Learn more"}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { locale } = useLocale();
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

  const isFrench = locale === "fr" || locale.startsWith("be_fr") || locale.startsWith("ch_fr");

  const productMenu = isFrench ? productMenuFR : productMenuEN;
  const developersMenu = isFrench ? developersMenuFR : developersMenuEN;
  const solutionsMenu = isFrench ? solutionsMenuFR : solutionsMenuEN;

  const navItems = [
    { name: t("product"), menu: productMenu },
    { name: t("solutions"), menu: solutionsMenu },
    { name: t("developers"), menu: developersMenu },
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
                  by Sky Genesis Enterprise
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
                  onMouseEnter={() => item.menu && setActiveMenu(item.name)}
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
                  {item.menu && (
                    <MegaMenuDropdown
                      menu={item.menu}
                      isOpen={activeMenu === item.name}
                      labels={{ learnMore: t("learnMore") }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <Link
              href={getLocaleHref("/contact")}
              className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("contactSales")}
            </Link>

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
                    <div className="pl-4 space-y-1 mt-1">
                      {item.menu?.sections.map((section) => (
                        <div key={section.title} className="py-2">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {section.title}
                          </span>
                          <div className="mt-2 space-y-1">
                            {section.items.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={getLocaleHref(subItem.href || "/")}
                                className="block py-1.5 text-sm text-muted-foreground hover:text-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
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
