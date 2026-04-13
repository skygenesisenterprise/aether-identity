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
  Clock,
  Landmark,
  ShoppingCart,
  HeartPulse,
  Building,
  LockOpen,
  Eye,
  Workflow,
  Layers,
  Scale,
  PenTool,
  FileCheck,
  Gauge,
} from "lucide-react";

export default async function PublicPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FGA" });

  const features = [
    {
      icon: LockOpen,
      title: t("features.rbac"),
      description: t("features.rbacDesc"),
    },
    {
      icon: Eye,
      title: t("features.abac"),
      description: t("features.abacDesc"),
    },
    {
      icon: Layers,
      title: t("features.hierarchical"),
      description: t("features.hierarchicalDesc"),
    },
    {
      icon: Scale,
      title: t("features.deny"),
      description: t("features.denyDesc"),
    },
    {
      icon: Workflow,
      title: t("features.conditions"),
      description: t("features.conditionsDesc"),
    },
    {
      icon: Gauge,
      title: t("features.realtime"),
      description: t("features.realtimeDesc"),
    },
  ];

  const metrics = [
    { value: "< 1ms", label: t("metrics.authorizationLatency") },
    { value: "10M+", label: t("metrics.policyEvaluations") },
    { value: "99.99%", label: t("metrics.slaAvailability") },
    { value: "Zero", label: t("metrics.vendorLockin") },
  ];

  const deploymentOptions = [
    {
      icon: Database,
      title: t("deployment.onPremise"),
      description: t("deployment.onPremiseDesc"),
    },
    {
      icon: Cloud,
      title: t("deployment.cloudNative"),
      description: t("deployment.cloudNativeDesc"),
    },
    {
      icon: GitBranch,
      title: t("deployment.hybrid"),
      description: t("deployment.hybridDesc"),
    },
  ];

  const sdkSupport = [
    { name: "Node.js", category: "Backend" },
    { name: "Go", category: "Backend" },
    { name: "Python", category: "Backend" },
    { name: "Java", category: "Backend" },
    { name: ".NET", category: "Backend" },
    { name: "React", category: "Frontend" },
    { name: "Vue", category: "Frontend" },
    { name: "Angular", category: "Frontend" },
    { name: "iOS", category: "Mobile" },
    { name: "Android", category: "Mobile" },
  ];

  const sampleCode = [
    {
      language: "typescript",
      filename: "authz.ts",
      code: `import { Aether Authorizer } from '@aether-identity/node';

const authorizer = new AetherAuthorizer({
  domain: 'auth.yourcompany.com',
  policyStore: 'policy-db',
});

// Check permissions with ABAC
const decision = await authorizer.check({
  action: 'read:document',
  resource: {
    id: doc.id,
    owner: doc.ownerId,
    department: doc.department,
    classification: doc.classification,
  },
  subject: {
    id: user.id,
    roles: user.roles,
    department: user.department,
    clearances: user.clearances,
  },
  context: {
    time: new Date(),
    ip: request.ip,
    device: request.deviceId,
  },
});

if (decision.effect === 'ALLOW') {
  // Access granted
}`,
    },
    {
      language: "json",
      filename: "policy.json",
      code: `{
  "version": "1.0",
  "policies": [
    {
      "id": "doc-access-policy",
      "effect": "ALLOW",
      "principals": ["role:employee"],
      "actions": ["doc:read", "doc:write"],
      "resources": ["resource:documents/*"],
      "conditions": {
        "match": {
          "subject.department": "resource.department"
        }
      }
    },
    {
      "id": "exec-only-policy",
      "effect": "ALLOW",
      "principals": ["role:executive"],
      "actions": ["*"],
      "resources": ["resource:documents/*"]
    },
    {
      "id": "deny-confidential",
      "effect": "DENY",
      "principals": ["role:employee"],
      "actions": ["doc:read"],
      "resources": ["resource:documents/*"],
      "conditions": {
        "equals": {
          "resource.classification": "confidential"
        }
      }
    }
  ]
}`,
    },
  ];

  const complianceStandards = [
    t("compliance.soc2"),
    t("compliance.gdpr"),
    t("compliance.hipaa"),
    t("compliance.iso"),
    t("compliance.pci"),
    t("compliance.fedramp"),
  ];

  const industries = [
    {
      icon: HeartPulse,
      title: t("industries.healthcare"),
      description: t("industries.healthcareDesc"),
    },
    {
      icon: Landmark,
      title: t("industries.finance"),
      description: t("industries.financeDesc"),
    },
    {
      icon: Building,
      title: t("industries.government"),
      description: t("industries.governmentDesc"),
    },
    {
      icon: ShoppingCart,
      title: t("industries.ecommerce"),
      description: t("industries.ecommerceDesc"),
    },
  ];

  const faqs = [
    {
      question: t("faq.rbacVsAbac.title"),
      answer: t("faq.rbacVsAbac.answer"),
    },
    {
      question: t("faq.policyUpdates.title"),
      answer: t("faq.policyUpdates.answer"),
    },
    {
      question: t("faq.integration.title"),
      answer: t("faq.integration.answer"),
    },
    {
      question: t("faq.freeTier.title"),
      answer: t("faq.freeTier.answer"),
    },
    {
      question: t("faq.performance.title"),
      answer: t("faq.performance.answer"),
    },
  ];

  const resources = [
    {
      icon: FileText,
      title: t("resources.whitepaper"),
      description: t("resources.whitepaperDesc"),
    },
    {
      icon: BookOpen,
      title: t("resources.ebook"),
      description: t("resources.ebookDesc"),
    },
    {
      icon: Calendar,
      title: t("resources.webinar"),
      description: t("resources.webinarDesc"),
    },
    {
      icon: BarChart3,
      title: t("resources.caseStudy"),
      description: t("resources.caseStudyDesc"),
    },
  ];

  const recentUpdates = [
    {
      version: "v2.4.0",
      date: "March 2026",
      description: "Graph-based policy evaluation and improved hierarchy support",
    },
    {
      version: "v2.3.0",
      date: "February 2026",
      description: "Custom condition functions and policy testing framework",
    },
    {
      version: "v2.2.0",
      date: "January 2026",
      description: "Kubernetes operator improvements and multi-region support",
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
                <Link href="/docs">
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
                <div key={metric.label}>
                  <div className="text-3xl sm:text-4xl font-semibold text-foreground">
                    {metric.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{metric.label}</div>
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
                <div key={feature.title} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <feature.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-13">
                    {feature.description}
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
                  <Link href="/docs/quickstarts">
                    <Button variant="secondary" size="lg" className="gap-2">
                      <Code2 className="h-4 w-4" />
                      {t("code.quickstart")}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <CodeBlock samples={sampleCode} defaultLanguage="json" />
              </div>
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
                  key={option.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <option.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{option.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {option.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Use Cases */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("industries.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("industries.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {industries.map((industry) => (
                <div
                  key={industry.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <industry.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{industry.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {industry.description}
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
                    {t("compliance.policyEncryption")}
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Lock className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">TLS 1.3</div>
                  <div className="text-sm text-muted-foreground">
                    {t("compliance.apiEncryption")}
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <FileCheck className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Audit Logs</div>
                  <div className="text-sm text-muted-foreground">{t("compliance.auditTrail")}</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <PenTool className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Policy Tests</div>
                  <div className="text-sm text-muted-foreground">
                    {t("compliance.preDeployment")}
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
                  key={resource.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors cursor-pointer"
                >
                  <resource.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {resource.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Updates */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("updates.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("updates.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {recentUpdates.map((update) => (
                <div
                  key={update.version}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{update.date}</span>
                  </div>
                  <div className="text-lg font-semibold text-foreground mb-2">{update.version}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {update.description}
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
                <Link href="/docs">
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    {t("cta.getStarted")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
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
