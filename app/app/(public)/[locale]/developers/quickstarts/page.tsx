import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/public/CodeBlock";
import {
  ArrowRight,
  Terminal,
  Smartphone,
  Server,
  Box,
  Zap,
  Shield,
  Cloud,
  Database,
  Container,
  Laptop,
  Rocket,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

const quickstartCategories = [
  {
    icon: Laptop,
    title: "Web Applications",
    description:
      "Full-stack web applications with popular frameworks like Next.js, React, Vue, and Angular.",
    guides: ["Next.js", "React", "Vue", "Angular", "Svelte"],
  },
  {
    icon: Server,
    title: "Backend Services",
    description: "Server-side integration with Node.js, Python, Go, Java, and .NET applications.",
    guides: ["Node.js", "Python", "Go", "Java", ".NET"],
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description:
      "Native and cross-platform mobile applications for iOS, Android, React Native, and Flutter.",
    guides: ["iOS (Swift)", "Android (Kotlin)", "React Native", "Flutter"],
  },
  {
    icon: Container,
    title: "Infrastructure",
    description:
      "Deploy and manage Aether Identity with Docker, Kubernetes, or bare metal servers.",
    guides: ["Docker", "Kubernetes", "Binary", "Helm"],
  },
];

const integrationExamples = [
  {
    language: "typescript",
    filename: "web-integration.tsx",
    code: `import { AetherProvider, useAuth } from '@aether-identity/react';

function App() {
  return (
    <AetherProvider domain="https://auth.yourcompany.com">
      <LoginButton />
    </AetherProvider>
  );
}

function LoginButton() {
  const { login, user, logout } = useAuth();
  
  return user ? (
    <button onClick={logout}>Sign out</button>
  ) : (
    <button onClick={login}>Sign in</button>
  );
}`,
  },
  {
    language: "python",
    filename: "backend-verify.py",
    code: `from aether_client import AetherClient

app = FastAPI()

@app.get("/protected")
async def protected_route(request: Request):
    client = AetherClient(
        domain='https://auth.yourcompany.com',
        client_id=os.environ['CLIENT_ID'],
        client_secret=os.environ['CLIENT_SECRET'],
    )
    
    user = await client.verify(
        request.headers['Authorization']
    )
    
    return {"user": user.email}`,
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Get Started in Minutes",
    description:
      "Pre-configured templates and step-by-step guides help you integrate authentication quickly.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description:
      "Every quickstart includes best practices for security, token management, and session handling.",
  },
  {
    icon: BookOpen,
    title: "Well Documented",
    description:
      "Each guide covers installation, configuration, and common use cases with practical examples.",
  },
  {
    icon: Rocket,
    title: "Production Ready",
    description:
      "Templates follow production best practices with error handling, logging, and monitoring.",
  },
];

const comparisonOptions = [
  {
    title: "SPA vs Traditional",
    description: "Choose the best approach for your application architecture",
    link: "/docs/quickstarts/spa",
  },
  {
    title: "Mobile Authentication",
    description: "Compare native SDKs vs web-based authentication",
    link: "/docs/quickstarts/mobile",
  },
  {
    title: "Self-hosted vs Cloud",
    description: "Deployment options and infrastructure requirements",
    link: "/docs/quickstarts/deployment",
  },
];

export default async function QuickstartsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DevelopersQuickstarts" });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header locale={locale as import("@/lib/locale").Locale} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                {t("hero.badge")}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                {t("hero.title")}
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                {t("hero.description")}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link href="#categories">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    {t("hero.ctaBrowse")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/${locale}/docs`}>
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    <BookOpen className="h-4 w-4" />
                    {t("hero.ctaDocs")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quickstart Categories */}
        <section id="categories" className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("categories.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("categories.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Laptop,
                  title: t("categories.webApps"),
                  description: t("categories.webAppsDesc"),
                  guides: ["Next.js", "React", "Vue", "Angular", "Svelte"],
                },
                {
                  icon: Server,
                  title: t("categories.backend"),
                  description: t("categories.backendDesc"),
                  guides: ["Node.js", "Python", "Go", "Java", ".NET"],
                },
                {
                  icon: Smartphone,
                  title: t("categories.mobile"),
                  description: t("categories.mobileDesc"),
                  guides: ["iOS (Swift)", "Android (Kotlin)", "React Native", "Flutter"],
                },
                {
                  icon: Container,
                  title: t("categories.infrastructure"),
                  description: t("categories.infrastructureDesc"),
                  guides: ["Docker", "Kubernetes", "Binary", "Helm"],
                },
              ].map((category) => (
                <div
                  key={category.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-foreground/5">
                      <category.icon className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.guides.length} guides available
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {category.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.guides.map((guide) => (
                      <span
                        key={guide}
                        className="px-2.5 py-1 text-xs font-medium bg-muted rounded-md text-foreground"
                      >
                        {guide}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="py-20 lg:py-28 bg-foreground text-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-balance">
                  {t("code.title")}
                </h2>
                <p className="mt-4 text-lg text-background/70 leading-relaxed">
                  {t("code.description")}
                </p>
                <div className="mt-8 space-y-3">
                  {[
                    t("code.pkce"),
                    t("code.tokenRefresh"),
                    t("code.session"),
                    t("code.logout"),
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="text-sm text-background/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <CodeBlock samples={integrationExamples} defaultLanguage="typescript" />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("benefits.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("benefits.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Zap, title: t("benefits.fast"), description: t("benefits.fastDesc") },
                {
                  icon: Shield,
                  title: t("benefits.secure"),
                  description: t("benefits.secureDesc"),
                },
                { icon: BookOpen, title: t("benefits.docs"), description: t("benefits.docsDesc") },
                {
                  icon: Rocket,
                  title: t("benefits.production"),
                  description: t("benefits.productionDesc"),
                },
              ].map((benefit) => (
                <div key={benefit.title} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <benefit.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{benefit.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison/Decision */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("comparison.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("comparison.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: t("comparison.spa"),
                  description: t("comparison.spaDesc"),
                  link: "/docs/quickstarts/spa",
                },
                {
                  title: t("comparison.mobileAuth"),
                  description: t("comparison.mobileAuthDesc"),
                  link: "/docs/quickstarts/mobile",
                },
                {
                  title: t("comparison.deployment"),
                  description: t("comparison.deploymentDesc"),
                  link: "/docs/quickstarts/deployment",
                },
              ].map((option) => (
                <div
                  key={option.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">{option.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {option.description}
                  </p>
                  <Link
                    href={`${locale}${option.link}`}
                    className="text-sm font-medium text-foreground hover:text-foreground/70 inline-flex items-center gap-1"
                  >
                    Learn more <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("tools.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("tools.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Terminal,
                  title: "CLI",
                  description: "Command-line tools for management and automation",
                },
                {
                  icon: Box,
                  title: "Postman",
                  description: "Pre-configured API collections for testing",
                },
                {
                  icon: Cloud,
                  title: "Terraform",
                  description: "Infrastructure as Code for cloud deployments",
                },
                {
                  icon: Database,
                  title: "Monitoring",
                  description: "Prometheus metrics and Grafana dashboards",
                },
              ].map((tool) => (
                <div
                  key={tool.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <tool.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28 border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("cta.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">{t("cta.description")}</p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="#categories">
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    {t("cta.getStarted")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/${locale}/developers`}>
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    {t("cta.viewAll")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale as "fr" | "be_fr" | "be_nl" | "ch_fr"} />
    </div>
  );
}
