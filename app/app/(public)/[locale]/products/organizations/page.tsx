import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import {
  Building2,
  Users,
  Shield,
  Settings,
  Key,
  Workflow,
  Link2,
  ArrowRight,
  CheckCircle2,
  LayoutGrid,
  UserCheck,
  FileText,
  BarChart3,
  Clock,
  Lock,
  Globe,
  ChevronDown,
  FolderKanban,
  Crown,
  X,
} from "lucide-react";

export default async function OrganizationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Organizations" });

  const features = [
    { icon: Building2, titleKey: "features.multiOrg", descKey: "features.multiOrgDesc" },
    { icon: Users, titleKey: "features.teamHierarchy", descKey: "features.teamHierarchyDesc" },
    { icon: UserCheck, titleKey: "features.userLifecycle", descKey: "features.userLifecycleDesc" },
    { icon: Key, titleKey: "features.roles", descKey: "features.rolesDesc" },
    { icon: Shield, titleKey: "features.security", descKey: "features.securityDesc" },
    { icon: Settings, titleKey: "features.settings", descKey: "features.settingsDesc" },
  ];

  const adminFeatures = [
    { icon: LayoutGrid, titleKey: "admin.dashboard", descKey: "admin.dashboardDesc" },
    { icon: FileText, titleKey: "admin.audit", descKey: "admin.auditDesc" },
    { icon: BarChart3, titleKey: "admin.analytics", descKey: "admin.analyticsDesc" },
    { icon: Globe, titleKey: "admin.federation", descKey: "admin.federationDesc" },
  ];

  const metrics = [
    { value: "Unlimited", labelKey: "metrics.organizations" },
    { value: "Unlimited", labelKey: "metrics.usersPerOrg" },
    { value: "< 10ms", labelKey: "metrics.permissionCheck" },
    { value: "99.99%", labelKey: "metrics.sla" },
  ];

  const useCases = [
    { titleKey: "useCases.fleet.title", descKey: "useCases.fleet.desc", icon: Building2 },
    { titleKey: "useCases.saas.title", descKey: "useCases.saas.desc", icon: FolderKanban },
    { titleKey: "useCases.government.title", descKey: "useCases.government.desc", icon: Crown },
    { titleKey: "useCases.partner.title", descKey: "useCases.partner.desc", icon: Link2 },
  ];

  const comparison = [
    { featureKey: "comparison.multiOrg", aether: true, keycloak: true, auth0: false, okta: true },
    { featureKey: "comparison.hierarchy", aether: true, keycloak: true, auth0: false, okta: true },
    { featureKey: "comparison.mfa", aether: true, keycloak: true, auth0: true, okta: true },
    {
      featureKey: "comparison.federation",
      aether: true,
      keycloak: true,
      auth0: false,
      okta: false,
    },
    { featureKey: "comparison.delegated", aether: true, keycloak: true, auth0: true, okta: true },
    { featureKey: "comparison.audit", aether: true, keycloak: false, auth0: true, okta: true },
    { featureKey: "comparison.branding", aether: true, keycloak: true, auth0: true, okta: true },
    {
      featureKey: "comparison.sla",
      aether: "99.99%",
      keycloak: "N/A",
      auth0: "99.9%",
      okta: "99.9%",
    },
  ];

  const faqs = [
    { questionKey: "faq.multi.title", answerKey: "faq.multi.answer" },
    { questionKey: "faq.partition.title", answerKey: "faq.partition.answer" },
    { questionKey: "faq.limit.title", answerKey: "faq.limit.answer" },
    { questionKey: "faq.branding.title", answerKey: "faq.branding.answer" },
    { questionKey: "faq.permissions.title", answerKey: "faq.permissions.answer" },
  ];

  const faqItems = faqs.map((faq) => ({
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

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
                <Link href={`/${locale}/docs`}>
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    {t("hero.ctaDocs")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/${locale}/contact`}>
                  <Button variant="outline" size="lg" className="h-12 px-6 text-base">
                    {t("hero.ctaContact")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="py-16 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {metrics.map((metric) => (
                <div key={metric.labelKey}>
                  <div className="text-3xl sm:text-4xl font-semibold text-foreground">
                    {metric.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{t(metric.labelKey)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("features.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("features.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.titleKey} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <feature.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      {t(feature.titleKey)}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-13">
                    {t(feature.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
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
            <div className="overflow-x-auto">
              <table className="w-full min-w-150">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                      {t("comparison.feature")}
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-foreground">
                      Aether
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      Keycloak
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      Auth0
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      Okta
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.featureKey} className="border-b border-border/50">
                      <td className="py-4 px-4 text-sm text-foreground">{t(row.featureKey)}</td>
                      <td className="py-4 px-4 text-center">
                        {typeof row.aether === "boolean" ? (
                          row.aether ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm font-medium text-foreground">{row.aether}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.keycloak === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                        ) : row.keycloak === false ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        ) : (
                          <span className="text-sm text-muted-foreground">{row.keycloak}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.auth0 === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                        ) : row.auth0 === false ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        ) : (
                          <span className="text-sm text-muted-foreground">{row.auth0}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.okta === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                        ) : row.okta === false ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        ) : (
                          <span className="text-sm text-muted-foreground">{row.okta}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Admin Features */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("admin.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("admin.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {adminFeatures.map((feature) => (
                <div
                  key={feature.titleKey}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <feature.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(feature.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("useCases.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("useCases.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase) => (
                <div
                  key={useCase.titleKey}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <useCase.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t(useCase.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(useCase.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                  {t("security.title")}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  {t("security.description")}
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-base font-semibold text-foreground">
                        {t("security.mfa.title")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("security.mfa.description")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-base font-semibold text-foreground">
                        {t("security.access.title")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("security.access.description")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-base font-semibold text-foreground">
                        {t("security.audit.title")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("security.audit.description")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Workflow className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-base font-semibold text-foreground">
                        {t("security.workflows.title")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("security.workflows.description")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-lg bg-background border border-border">
                  <Users className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">
                    {t("security.isolated.title")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("security.isolated.description")}
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-background border border-border">
                  <Key className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">
                    {t("security.scoped.title")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("security.scoped.description")}
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-background border border-border">
                  <Settings className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">
                    {t("security.custom.title")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("security.custom.description")}
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-background border border-border">
                  <Clock className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">
                    {t("security.audited.title")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("security.audited.description")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("faq.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("faq.description")}
              </p>
            </div>
            <FaqAccordion faqs={faqItems} />
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
                <Link href={`/${locale}/docs`}>
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    {t("cta.getStarted")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/${locale}/contact`}>
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    {t("cta.contactSales")}
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
