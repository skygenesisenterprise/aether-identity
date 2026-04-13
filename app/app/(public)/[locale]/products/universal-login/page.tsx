import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons/GitHubIcon";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { CodeBlock } from "@/components/public/CodeBlock";
import {
  Shield,
  Lock,
  Fingerprint,
  ArrowRight,
  Code2,
  CheckCircle2,
  GitBranch,
  Database,
  Cloud,
  FileText,
  BookOpen,
  Calendar,
  BarChart3,
  LogIn,
  RefreshCw,
  Smartphone,
  Monitor,
  Gauge,
  Layers,
  Plug,
} from "lucide-react";

const capabilities = [
  {
    icon: LogIn,
    titleKey: "universalAuth",
    descriptionKey: "universalAuthDesc",
  },
  {
    icon: RefreshCw,
    titleKey: "sessionSync",
    descriptionKey: "sessionSyncDesc",
  },
  {
    icon: Smartphone,
    titleKey: "crossDeviceSso",
    descriptionKey: "crossDeviceSsoDesc",
  },
  {
    icon: Fingerprint,
    titleKey: "adaptiveAuth",
    descriptionKey: "adaptiveAuthDesc",
  },
  {
    icon: Monitor,
    titleKey: "customizableBranding",
    descriptionKey: "customizableBrandingDesc",
  },
  {
    icon: Plug,
    titleKey: "idpIntegration",
    descriptionKey: "idpIntegrationDesc",
  },
];

const metrics = [
  { value: "< 50ms", labelKey: "loginPageLoad" },
  { value: "99.99%", labelKey: "sla" },
  { value: "10M+", labelKey: "loginsPerMonth" },
  { value: "Zero", labelKey: "passwordFatigue" },
];

const deploymentOptions = [
  {
    icon: Cloud,
    titleKey: "cloudHosted",
    descriptionKey: "cloudHostedDesc",
  },
  {
    icon: Database,
    titleKey: "onPremise",
    descriptionKey: "onPremiseDesc",
  },
  {
    icon: GitBranch,
    titleKey: "hybrid",
    descriptionKey: "hybridDesc",
  },
];

const sdkSupport = [
  { name: "React", category: "Frontend" },
  { name: "Vue", category: "Frontend" },
  { name: "Angular", category: "Frontend" },
  { name: "iOS", category: "Mobile" },
  { name: "Android", category: "Mobile" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "Go", category: "Backend" },
];

const sampleCode = [
  {
    language: "typescript",
    filename: "universal-login.tsx",
    code: `import { UniversalLogin } from '@aether-identity/react';

export function LoginPage() {
  return (
    <UniversalLogin
      theme="custom"
      logo="/logo.png"
      backgroundImage="/bg.jpg"
      providers={['google', 'github', 'microsoft']}
      mfaEnabled={true}
      onSuccess={(user) => {
        console.log('Authenticated:', user);
      }}
    />
  );
}`,
  },
  {
    language: "typescript",
    filename: "react-native.tsx",
    code: `import { UniversalLogin } from '@aether-identity/react-native';

export default function App() {
  return (
    <UniversalLogin
      theme="dark"
      logo={require('./assets/logo.png')}
      providers={['apple', 'google']}
      onSuccess={handleAuth}
    />
  );
}`,
  },
];

const complianceStandards = [
  "SOC 2 Type II",
  "GDPR",
  "HIPAA",
  "ISO 27001",
  "PCI DSS",
  "FedRAMP Ready",
];

const features = [
  {
    titleKey: "passwordless",
    descriptionKey: "passwordlessDesc",
  },
  {
    titleKey: "socialLogin",
    descriptionKey: "socialLoginDesc",
  },
  {
    titleKey: "enterpriseSso",
    descriptionKey: "enterpriseSsoDesc",
  },
  {
    titleKey: "mfa",
    descriptionKey: "mfaDesc",
  },
  {
    titleKey: "progressiveProfiling",
    descriptionKey: "progressiveProfilingDesc",
  },
  {
    titleKey: "accountRecovery",
    descriptionKey: "accountRecoveryDesc",
  },
];

const resources = [
  {
    icon: FileText,
    titleKey: "documentation",
    descriptionKey: "documentationDesc",
  },
  {
    icon: BookOpen,
    titleKey: "tutorial",
    descriptionKey: "tutorialDesc",
  },
  {
    icon: Calendar,
    titleKey: "webinar",
    descriptionKey: "webinarDesc",
  },
  {
    icon: BarChart3,
    titleKey: "caseStudy",
    descriptionKey: "caseStudyDesc",
  },
] as const;

interface Capability {
  icon: typeof LogIn;
  titleKey: string;
  descriptionKey: string;
}

interface Feature {
  titleKey: string;
  descriptionKey: string;
}

interface Metric {
  value: string;
  labelKey: string;
}

interface DeploymentOption {
  icon: typeof Cloud;
  titleKey: string;
  descriptionKey: string;
}

interface Resource {
  icon: typeof FileText;
  titleKey: string;
  descriptionKey: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export default async function UniversalLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "UniversalLogin" });

  const faqs = [
    {
      question: t("faq.diff.title"),
      answer: t("faq.diff.answer"),
    },
    {
      question: t("faq.idp.title"),
      answer: t("faq.idp.answer"),
    },
    {
      question: t("faq.customize.title"),
      answer: t("faq.customize.answer"),
    },
    {
      question: t("faq.passwordless.title"),
      answer: t("faq.passwordless.answer"),
    },
    {
      question: t("faq.down.title"),
      answer: t("faq.down.answer"),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

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

        {/* Features Grid */}
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
                  <div className="flex flex-wrap gap-2">
                    {sdkSupport.map((sdk) => (
                      <span
                        key={sdk.name}
                        className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80"
                      >
                        {sdk.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-8">
                  <Link href={`/${locale}/docs/quickstarts`}>
                    <Button variant="secondary" size="lg" className="gap-2">
                      <Code2 className="h-4 w-4" />
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

        {/* Detailed Features */}
        <section className="py-20 lg:py-28 border-b border-border">
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
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`features.${feature.descriptionKey}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Deployment Options */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("deployment.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("deployment.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {deploymentOptions.map((option) => (
                <div
                  key={option.titleKey}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <option.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t(`deployment.${option.titleKey}`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`deployment.${option.descriptionKey}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                  {t("compliance.title")}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  {t("compliance.description")}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {complianceStandards.map((standard) => (
                    <div key={standard} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="text-sm text-foreground">{standard}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Shield className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">AES-256</div>
                  <div className="text-sm text-muted-foreground">
                    {t("compliance.encryptionRest")}
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Lock className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">TLS 1.3</div>
                  <div className="text-sm text-muted-foreground">
                    {t("compliance.encryptionTransit")}
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Gauge className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">99.99%</div>
                  <div className="text-sm text-muted-foreground">{t("compliance.uptime")}</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Layers className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">2FA</div>
                  <div className="text-sm text-muted-foreground">{t("compliance.2fa")}</div>
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
            <FaqAccordion faqs={faqs} />
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("resources.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("resources.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resources.map((resource) => (
                <div
                  key={resource.titleKey}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors cursor-pointer"
                >
                  <resource.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t(`resources.${resource.titleKey}`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`resources.${resource.descriptionKey}`)}
                  </p>
                </div>
              ))}
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
