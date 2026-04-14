import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons/GitHubIcon";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { CodeBlock } from "@/components/public/CodeBlock";
import {
  Lock,
  Users,
  Globe,
  ArrowRight,
  Fingerprint,
  Key,
  Zap,
  CheckCircle2,
  Layers,
  RefreshCw,
  Building2,
  HeadphonesIcon,
  X,
} from "lucide-react";

const capabilities = [
  { icon: Globe, titleKey: "universalSso", descriptionKey: "universalSsoDesc" },
  { icon: Lock, titleKey: "identityProtocols", descriptionKey: "identityProtocolsDesc" },
  { icon: Fingerprint, titleKey: "adaptiveMfa", descriptionKey: "adaptiveMfaDesc" },
  { icon: Users, titleKey: "userManagement", descriptionKey: "userManagementDesc" },
  { icon: Layers, titleKey: "appGateway", descriptionKey: "appGatewayDesc" },
  { icon: RefreshCw, titleKey: "sessionFederation", descriptionKey: "sessionFederationDesc" },
];

const features = [
  { titleKey: "samlSpIdp", descriptionKey: "samlSpIdpDesc" },
  { titleKey: "oauth", descriptionKey: "oauthDesc" },
  { titleKey: "identityBrokering", descriptionKey: "identityBrokeringDesc" },
  { titleKey: "attributeMapping", descriptionKey: "attributeMappingDesc" },
  { titleKey: "trustChain", descriptionKey: "trustChainDesc" },
  { titleKey: "auditCompliance", descriptionKey: "auditComplianceDesc" },
];

const metrics = [
  { value: "< 10ms", labelKey: "ssoLatency" },
  { value: "99.99%", labelKey: "availability" },
  { value: "500+", labelKey: "integrations" },
  { value: "Zero", labelKey: "downtime" },
];

const sampleCode = [
  {
    language: "xml",
    filename: "saml-config.xml",
    code: `<!-- SAML Service Provider Configuration -->
< SAML>
  <EntityID>https://sso.company.com/sp</EntityID>
  <AssertionConsumerService 
    Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
    Location="https://sso.company.com/acs" />
  <SingleLogoutService 
    Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
    Location="https://sso.company.com/slo" />
  <NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</NameIDFormat>
</SAML>`,
  },
  {
    language: "typescript",
    filename: "sso-client.ts",
    code: `import { AetherSSO } from '@aether-identity/node';

const sso = new AetherSSO({
  domain: 'sso.company.com',
  clientId: process.env.SSO_CLIENT_ID,
  protocol: 'saml', // or 'oidc'
});

// Initiate SSO flow
const authUrl = await sso.authorize({
  redirectUri: 'https://app.company.com/callback',
  scope: 'openid profile email',
});

// Handle callback
const { user, session } = await sso.verifyCallback(url);`,
  },
];

const comparison = [
  { featureKey: "comparison.selfHosted", aether: true, okta: false, auth0: false, azure: false },
  { featureKey: "comparison.saml", aether: true, okta: true, auth0: true, azure: true },
  { featureKey: "comparison.oidc", aether: true, okta: true, auth0: true, azure: true },
  { featureKey: "comparison.brokering", aether: true, okta: true, auth0: true, azure: true },
  { featureKey: "comparison.gateway", aether: true, okta: false, auth0: false, azure: true },
  { featureKey: "comparison.plugins", aether: true, okta: false, auth0: false, azure: false },
  { featureKey: "comparison.pricing", aether: true, okta: false, auth0: false, azure: false },
];

export default async function SSOPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SSO" });

  const faqs = [
    {
      question: t("faq.diff.title"),
      answer: t("faq.diff.answer"),
    },
    {
      question: t("faq.multiIdp.title"),
      answer: t("faq.multiIdp.answer"),
    },
    {
      question: t("faq.legacy.title"),
      answer: t("faq.legacy.answer"),
    },
    {
      question: t("faq.migration.title"),
      answer: t("faq.migration.answer"),
    },
    {
      question: t("faq.limits.title"),
      answer: t("faq.limits.answer"),
    },
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
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
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
                <Link href="https://github.com/skygenesisenterprise/aether-identity">
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    <GitHubIcon className="h-4 w-4" />
                    {t("hero.ctaGithub")}
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
                  <div className="mt-1 text-sm text-muted-foreground">
                    {t(`metrics.${metric.labelKey}`)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Capabilities */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("capabilities.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("capabilities.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {capabilities.map((capability) => (
                <div key={capability.titleKey} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <capability.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      {t(`capabilities.${capability.titleKey}`)}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-13">
                    {t(`capabilities.${capability.descriptionKey}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Protocol Features */}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.titleKey}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t(`features.${feature.titleKey}`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {t(`features.${feature.descriptionKey}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 lg:py-28 border-b border-border">
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
                      Feature
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-foreground">
                      Aether SSO
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      Okta
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      Auth0
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      Azure AD
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.featureKey} className="border-b border-border/50">
                      <td className="py-4 px-4 text-sm text-foreground">{t(row.featureKey)}</td>
                      <td className="py-4 px-4 text-center">
                        {row.aether === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.okta === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.auth0 === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.azure === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Code Example Section */}
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
                <div className="mt-8">
                  <Link href={`/${locale}/docs/quickstarts`}>
                    <Button variant="secondary" size="lg" className="gap-2">
                      <Zap className="h-4 w-4" />
                      {t("code.cta")}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <CodeBlock samples={sampleCode} defaultLanguage="xml" />
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("useCases.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("useCases.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-border bg-card">
                <Key className="h-8 w-8 text-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("useCases.multiIdp")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("useCases.multiIdpDesc")}
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <Layers className="h-8 w-8 text-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("useCases.legacyApp")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("useCases.legacyAppDesc")}
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <Building2 className="h-8 w-8 text-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("useCases.b2bPartner")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("useCases.b2bPartnerDesc")}
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <HeadphonesIcon className="h-8 w-8 text-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("useCases.multiRegion")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("useCases.multiRegionDesc")}
                </p>
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
            <FaqAccordion faqs={faqs} />
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
