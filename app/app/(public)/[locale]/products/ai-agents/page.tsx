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
  Key,
  Zap,
  ArrowRight,
  Code2,
  Building2,
  CheckCircle2,
  GitBranch,
  Database,
  Cloud,
  FileText,
  BookOpen,
  Calendar,
  BarChart3,
  Clock,
  X,
  Landmark,
  ShoppingCart,
  HeartPulse,
  Building,
  Brain,
  Network,
  Eye,
  Workflow,
} from "lucide-react";

export default async function PublicPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AIAgents" });

  const capabilities = [
    {
      icon: Brain,
      title: t("capabilities.aiNative"),
      description: t("capabilities.aiNativeDesc"),
    },
    {
      icon: Key,
      title: t("capabilities.credentials"),
      description: t("capabilities.credentialsDesc"),
    },
    {
      icon: Network,
      title: t("capabilities.mesh"),
      description: t("capabilities.meshDesc"),
    },
    {
      icon: Shield,
      title: t("capabilities.security"),
      description: t("capabilities.securityDesc"),
    },
    {
      icon: Workflow,
      title: t("capabilities.workflows"),
      description: t("capabilities.workflowsDesc"),
    },
    {
      icon: Eye,
      title: t("capabilities.observability"),
      description: t("capabilities.observabilityDesc"),
    },
  ];

  const metrics = [
    { value: "< 5ms", label: t("metrics.agentAuth") },
    { value: "10K+", label: t("metrics.agentsSupported") },
    { value: "99.99%", label: t("metrics.slaAvailability") },
    { value: "Zero", label: t("metrics.credentialLeaks") },
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
    { name: "Python", category: "SDK" },
    { name: "TypeScript", category: "SDK" },
    { name: "Go", category: "SDK" },
    { name: "Rust", category: "SDK" },
    { name: "OpenAI", category: "Integration" },
    { name: "Anthropic", category: "Integration" },
    { name: "LangChain", category: "Integration" },
    { name: "CrewAI", category: "Integration" },
    { name: "AutoGen", category: "Integration" },
    { name: "Vertex AI", category: "Integration" },
  ];

  const sampleCode = [
    {
      language: "typescript",
      filename: "agent-auth.ts",
      code: `import { AetherAgent } from '@aether-identity/agent';

const agent = new AetherAgent({
  domain: 'auth.yourcompany.com',
  agentId: process.env.AETHER_AGENT_ID,
  agentKey: process.env.AETHER_AGENT_KEY,
});

// Authenticate agent
await agent.authenticate();

// Execute workflow with scoped permissions
const result = await agent.execute('data-pipeline', {
  inputs: { dataset: 'customer-data' },
  permissions: ['read:data', 'write:results'],
});`,
    },
    {
      language: "python",
      filename: "agent_auth.py",
      code: `from aether_identity import AetherAgent

agent = AetherAgent(
    domain="auth.yourcompany.com",
    agent_id=os.environ["AETHER_AGENT_ID"],
    agent_key=os.environ["AETHER_AGENT_KEY"],
)

# Authenticate agent
await agent.authenticate()

# Execute workflow with scoped permissions
result = await agent.execute(
    "data-pipeline",
    inputs={"dataset": "customer-data"},
    permissions=["read:data", "write:results"],
)`,
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

  const industries = [
    {
      icon: HeartPulse,
      title: t("industries.healthcare"),
      description: t("industries.healthcareDesc"),
    },
    {
      icon: Landmark,
      title: t("industries.financial"),
      description: t("industries.financialDesc"),
    },
    {
      icon: Building,
      title: t("industries.enterprise"),
      description: t("industries.enterpriseDesc"),
    },
    {
      icon: ShoppingCart,
      title: t("industries.ecommerce"),
      description: t("industries.ecommerceDesc"),
    },
  ];

  const faqs = [
    {
      question: t("faq.diffIam.title"),
      answer: t("faq.diffIam.answer"),
    },
    {
      question: t("faq.llm.title"),
      answer: t("faq.llm.answer"),
    },
    {
      question: t("faq.credentialSecurity.title"),
      answer: t("faq.credentialSecurity.answer"),
    },
    {
      question: t("faq.freeTier.title"),
      answer: t("faq.freeTier.answer"),
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

  const teamMembers = [
    { name: "Alex Chen", role: "CEO & Founder", image: "AC" },
    { name: "Sarah Miller", role: "CTO", image: "SM" },
    { name: "James Wilson", role: "VP Engineering", image: "JW" },
    { name: "Emily Davis", role: "Head of Security", image: "ED" },
  ];

  const recentUpdates = [
    {
      version: "v1.3.0",
      date: "March 2026",
      description: "Agent Mesh GA and improved inter-agent auth",
    },
    {
      version: "v1.2.0",
      date: "February 2026",
      description: "Autonomous security policies and anomaly detection",
    },
    {
      version: "v1.1.0",
      date: "January 2026",
      description: "Workflow execution with multi-step approvals",
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

        {/* Trusted By Section */}
        <section className="py-16 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {t("trustedBy")}
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
              <div className="text-xl font-semibold text-muted-foreground/60">Acme Corp</div>
              <div className="text-xl font-semibold text-muted-foreground/60">TechFlow</div>
              <div className="text-xl font-semibold text-muted-foreground/60">SecureBank</div>
              <div className="text-xl font-semibold text-muted-foreground/60">HealthPlus</div>
              <div className="text-xl font-semibold text-muted-foreground/60">GlobalSys</div>
              <div className="text-xl font-semibold text-muted-foreground/60">DataVault</div>
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
                <div key={capability.title} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <capability.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{capability.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-13">
                    {capability.description}
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
                {t("compare.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("compare.description")}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-150">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                      {t("compare.feature")}
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-semibold text-foreground">
                      {t("compare.aether")}
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      {t("compare.aws")}
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      {t("compare.azure")}
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      {t("compare.okta")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 text-sm text-foreground">
                      {t("compare.agentCredentials")}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 text-sm text-foreground">
                      {t("compare.capabilityScoping")}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 text-sm text-foreground">{t("compare.agentMesh")}</td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 text-sm text-foreground">
                      {t("compare.workflowExecution")}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 text-sm text-foreground">
                      {t("compare.autonomousSecurity")}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 text-sm text-foreground">{t("compare.selfHosted")}</td>
                    <td className="py-4 px-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 px-4 text-sm text-foreground">
                      {t("compare.slaGuarantee")}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm font-medium text-foreground">99.99%</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm text-muted-foreground">99.9%</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm text-muted-foreground">99.9%</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm text-muted-foreground">99.9%</span>
                    </td>
                  </tr>
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
                <CodeBlock samples={sampleCode} defaultLanguage="typescript" />
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
                  <Building2 className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Air-Gap</div>
                  <div className="text-sm text-muted-foreground">
                    {t("compliance.deploymentReady")}
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Zap className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Audit Logs</div>
                  <div className="text-sm text-muted-foreground">{t("compliance.auditTrail")}</div>
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

        {/* Team Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("team.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("team.description")}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="p-6 rounded-lg border border-border bg-card text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-semibold text-foreground">{member.image}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
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
