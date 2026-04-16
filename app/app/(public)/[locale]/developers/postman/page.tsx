import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Terminal,
  Download,
  Play,
  Layers,
  Clock,
  CheckCircle2,
  BookOpen,
  Code2,
  Box,
} from "lucide-react";

export default async function DevelopersPostmanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DevelopersPostman" });

  const features = [
    {
      icon: Download,
      title: t("features.oneClick"),
      description: t("features.oneClickDesc"),
    },
    {
      icon: Play,
      title: t("features.readyRun"),
      description: t("features.readyRunDesc"),
    },
    {
      icon: Layers,
      title: t("features.environment"),
      description: t("features.environmentDesc"),
    },
    {
      icon: Clock,
      title: t("features.saveTime"),
      description: t("features.saveTimeDesc"),
    },
  ];

  const collections = [
    {
      name: t("collections.oauthFlows"),
      description: t("collections.oauthFlowsDesc"),
      endpoints: 12,
    },
    {
      name: t("collections.userManagement"),
      description: t("collections.userManagementDesc"),
      endpoints: 8,
    },
    {
      name: t("collections.clientManagement"),
      description: t("collections.clientManagementDesc"),
      endpoints: 6,
    },
    {
      name: t("collections.sessionControl"),
      description: t("collections.sessionControlDesc"),
      endpoints: 5,
    },
    {
      name: t("collections.rolePermissions"),
      description: t("collections.rolePermissionsDesc"),
      endpoints: 7,
    },
    {
      name: t("collections.auditLogs"),
      description: t("collections.auditLogsDesc"),
      endpoints: 4,
    },
  ];

  const benefits = [
    t("benefits.noAuth"),
    t("benefits.autoRefresh"),
    t("benefits.scripts"),
    t("benefits.examples"),
    t("benefits.inheritance"),
    t("benefits.cli"),
  ];

  const languages = [
    t("languages.curl"),
    t("languages.jsFetch"),
    t("languages.python"),
    t("languages.go"),
    t("languages.java"),
    t("languages.dotnet"),
    t("languages.ruby"),
    t("languages.php"),
  ];

  const includedItems = [
    t("included.requests"),
    t("included.environment"),
    t("included.scripts"),
    t("included.responseExamples"),
    t("included.templates"),
    t("included.helpers"),
  ];

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
                <Button size="lg" className="gap-2 h-12 px-6 text-base">
                  <Download className="h-4 w-4" />
                  {t("hero.ctaImport")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Link href={`/${locale}/developers/api`}>
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    <BookOpen className="h-4 w-4" />
                    {t("hero.ctaDocs")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("features.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("features.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Download,
                  title: t("features.oneClick"),
                  description: t("features.oneClickDesc"),
                },
                {
                  icon: Play,
                  title: t("features.readyRun"),
                  description: t("features.readyRunDesc"),
                },
                {
                  icon: Layers,
                  title: t("features.environment"),
                  description: t("features.environmentDesc"),
                },
                {
                  icon: Clock,
                  title: t("features.saveTime"),
                  description: t("features.saveTimeDesc"),
                },
              ].map((feature) => (
                <div key={feature.title} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <feature.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Collections Overview */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("collections.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("collections.description")}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <div
                  key={collection.name}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">{collection.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{collection.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Box className="h-4 w-4" />
                    <span>
                      {collection.endpoints} {t("collections.endpoints")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 lg:py-28 border-b border-border bg-foreground text-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-balance">
                  {t("benefits.title")}
                </h2>
                <p className="mt-4 text-lg text-background/70 leading-relaxed">
                  {t("benefits.description")}
                </p>
                <div className="mt-8 grid gap-3">
                  {[
                    t("benefits.noAuth"),
                    t("benefits.autoRefresh"),
                    t("benefits.scripts"),
                    t("benefits.examples"),
                    t("benefits.inheritance"),
                    t("benefits.cli"),
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                      <span className="text-sm text-background/80">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4">
                <div className="p-6 rounded-lg bg-background/5 border border-background/10">
                  <Terminal className="h-8 w-8 text-background mb-4" />
                  <h3 className="text-lg font-semibold text-background mb-2">
                    {t("benefits.newman")}
                  </h3>
                  <p className="text-sm text-background/60">{t("benefits.newmanDesc")}</p>
                </div>
                <div className="p-6 rounded-lg bg-background/5 border border-background/10">
                  <Code2 className="h-8 w-8 text-background mb-4" />
                  <h3 className="text-lg font-semibold text-background mb-2">
                    {t("benefits.codeGen")}
                  </h3>
                  <p className="text-sm text-background/60">{t("benefits.codeGenDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("included.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("included.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                t("included.requests"),
                t("included.environment"),
                t("included.scripts"),
                t("included.responseExamples"),
                t("included.templates"),
                t("included.helpers"),
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Languages */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("languages.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("languages.description")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <span
                  key={lang}
                  className="px-4 py-2 text-sm bg-card border border-border rounded-md text-foreground"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("howItWorks.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("howItWorks.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-semibold text-foreground">1</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("howItWorks.step1")}
                </h3>
                <p className="text-sm text-muted-foreground">{t("howItWorks.step1Desc")}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-semibold text-foreground">2</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("howItWorks.step2")}
                </h3>
                <p className="text-sm text-muted-foreground">{t("howItWorks.step2Desc")}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-semibold text-foreground">3</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("howItWorks.step3")}
                </h3>
                <p className="text-sm text-muted-foreground">{t("howItWorks.step3Desc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("cta.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">{t("cta.description")}</p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="gap-2 h-12 px-8 text-base">
                  <Download className="h-4 w-4" />
                  {t("cta.ctaImport")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Link href={`/${locale}/developers/api`}>
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    {t("cta.ctaView")}
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
