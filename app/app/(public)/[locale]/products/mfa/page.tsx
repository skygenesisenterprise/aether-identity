import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons/GitHubIcon";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { CodeBlock } from "@/components/public/CodeBlock";
import {
  Fingerprint,
  Smartphone,
  Mail,
  MessageSquare,
  Key,
  ArrowRight,
  Eye,
  CheckCircle2,
  X,
  Gem,
  LockOpen,
  UserCheck,
  AlertTriangle,
  Zap,
} from "lucide-react";

const capabilities = [
  { icon: Fingerprint, titleKey: "webauthn", descriptionKey: "webauthnDesc" },
  { icon: Smartphone, titleKey: "totp", descriptionKey: "totpDesc" },
  { icon: Mail, titleKey: "email", descriptionKey: "emailDesc" },
  { icon: MessageSquare, titleKey: "sms", descriptionKey: "smsDesc" },
  { icon: Eye, titleKey: "adaptive", descriptionKey: "adaptiveDesc" },
  { icon: Key, titleKey: "hardware", descriptionKey: "hardwareDesc" },
];

const features = [
  { titleKey: "passwordless", descriptionKey: "passwordlessDesc" },
  { titleKey: "stepUp", descriptionKey: "stepUpDesc" },
  { titleKey: "enrollment", descriptionKey: "enrollmentDesc" },
  { titleKey: "recovery", descriptionKey: "recoveryDesc" },
  { titleKey: "policy", descriptionKey: "policyDesc" },
  { titleKey: "compliance", descriptionKey: "complianceDesc" },
];

const metrics = [
  { value: "99.99%", labelKey: "uptime" },
  { value: "< 5ms", labelKey: "verificationLatency" },
  { value: "100%", labelKey: "fido2Certified" },
  { value: "Zero", labelKey: "phishingIncidents" },
];

const sampleCode = [
  {
    language: "typescript",
    filename: "mfa-enrollment.ts",
    code: `import { AetherMFA } from '@aether-identity/node';

const mfa = new AetherMFA({
  domain: 'auth.company.com',
  clientId: process.env.MFA_CLIENT_ID,
});

// Enroll user in MFA
const enrollment = await mfa.enrollUser({
  userId: 'user-123',
  methods: ['totp', 'webauthn', 'sms'],
});

// Verify TOTP code
const verified = await mfa.verify({
  userId: 'user-123',
  code: '123456',
  method: 'totp',
});`,
  },
  {
    language: "typescript",
    filename: "policy-config.ts",
    code: `import { AetherPolicy } from '@aether-identity/node';

const policy = new AetherPolicy({
  domain: 'auth.company.com',
});

// Define adaptive MFA policy
await policy.create({
  name: 'Adaptive MFA Policy',
  rules: [
    {
      condition: 'risk_score > 70',
      requireMFA: true,
      methods: ['webauthn', 'totp'],
    },
    {
      condition: 'new_device',
      requireMFA: true,
      methods: ['any'],
    },
    {
      condition: 'trusted_network',
      requireMFA: false,
    },
  ],
});`,
  },
];

const comparison = [
  { feature: "Self-hosted MFA", aether: true, okta: false, auth0: false, duo: false },
  { feature: "WebAuthn / FIDO2", aether: true, okta: true, auth0: true, duo: true },
  { feature: "TOTP Support", aether: true, okta: true, auth0: true, duo: true },
  { feature: "Adaptive Risk-Based", aether: true, okta: true, auth0: true, duo: false },
  { feature: "Hardware Tokens", aether: true, okta: true, auth0: true, duo: false },
  { feature: "No per-user pricing", aether: true, okta: false, auth0: false, duo: false },
  { feature: "Full Audit Logs", aether: true, okta: true, auth0: true, duo: true },
];

const faqs = [
  {
    question: "How does Aether MFA compare to Duo Security?",
    answer:
      "Aether MFA offers all the features of Duo with self-hosted deployment, no per-user pricing, and full data sovereignty. You retain complete control over your authentication infrastructure.",
  },
  {
    question: "Can Aether integrate with our existing IdP?",
    answer:
      "Yes, Aether MFA integrates with any OAuth 2.0/OIDC provider, SAML IdP, or can operate as a standalone MFA solution. It works alongside Okta, Azure AD, Keycloak, and more.",
  },
  {
    question: "What happens if a user loses their second factor?",
    answer:
      "Aether provides multiple recovery options including backup codes, trusted device recovery, and admin-initiated recovery with identity verification. Recovery is logged for compliance.",
  },
  {
    question: "Is passwordless authentication supported?",
    answer:
      "Yes, Aether fully supports WebAuthn/FIDO2 for passwordless authentication. Users can authenticate with hardware keys, biometric sensors, or device-based credentials.",
  },
  {
    question: "Can we enforce MFA for specific users or groups?",
    answer:
      "Yes, Aether's policy engine allows granular enforcement rules based on user attributes, groups, IP ranges, risk scores, or any custom conditions.",
  },
];

export default async function MFAPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MFA" });

  const faqs = [
    {
      question: t("faq.duo.title"),
      answer: t("faq.duo.answer"),
    },
    {
      question: t("faq.idp.title"),
      answer: t("faq.idp.answer"),
    },
    {
      question: t("faq.loss.title"),
      answer: t("faq.loss.answer"),
    },
    {
      question: t("faq.passwordless.title"),
      answer: t("faq.passwordless.answer"),
    },
    {
      question: t("faq.enforce.title"),
      answer: t("faq.enforce.answer"),
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
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
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

        {/* Features Grid */}
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
                      Identity
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      Okta
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      Auth0
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      Duo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.feature} className="border-b border-border/50">
                      <td className="py-4 px-4 text-sm text-foreground">{row.feature}</td>
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
                        {row.duo === true ? (
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
                <CodeBlock samples={sampleCode} defaultLanguage="typescript" />
              </div>
            </div>
          </div>
        </section>

        {/* Security Benefits */}
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
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-border bg-card">
                <LockOpen className="h-8 w-8 text-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("benefits.vendorLockin")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("benefits.vendorLockinDesc")}
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <UserCheck className="h-8 w-8 text-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("benefits.frictionless")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("benefits.frictionlessDesc")}
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <AlertTriangle className="h-8 w-8 text-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("benefits.phishing")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("benefits.phishingDesc")}
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <Gem className="h-8 w-8 text-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("benefits.compliance")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("benefits.complianceDesc")}
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
