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
  ArrowRight,
  Server,
  Code2,
  CheckCircle2,
  Cloud,
  FileText,
  BookOpen,
  Calendar,
  BarChart3,
  X,
  Cpu,
  Network,
  Workflow,
  Gauge,
  Layers,
  Bot,
  AppWindow,
} from "lucide-react";

export default async function M2MPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "M2M" });

  const capabilities = [
    {
      icon: Key,
      title: t("capabilities.credentials"),
      description: t("capabilities.credentialsDesc"),
    },
    {
      icon: Shield,
      title: t("capabilities.apiKeys"),
      description: t("capabilities.apiKeysDesc"),
    },
    {
      icon: Network,
      title: t("capabilities.serviceMesh"),
      description: t("capabilities.serviceMeshDesc"),
    },
    {
      icon: Lock,
      title: t("capabilities.mtls"),
      description: t("capabilities.mtlsDesc"),
    },
    {
      icon: Server,
      title: t("capabilities.selfHosted"),
      description: t("capabilities.selfHostedDesc"),
    },
    {
      icon: Workflow,
      title: t("capabilities.introspection"),
      description: t("capabilities.introspectionDesc"),
    },
  ];

  const metrics = [
    { value: "< 5ms", label: t("metrics.tokenLatency") },
    { value: "100K+", label: t("metrics.requestsPerSecond") },
    { value: "99.99%", label: t("metrics.slaAvailability") },
    { value: "Zero", label: t("metrics.vendorLockin") },
  ];

  const protocols = [
    {
      icon: Lock,
      title: t("protocols.oauth"),
      description: t("protocols.oauthDesc"),
    },
    {
      icon: Shield,
      title: t("protocols.oidc"),
      description: t("protocols.oidcDesc"),
    },
    {
      icon: Network,
      title: t("protocols.mtls"),
      description: t("protocols.mtlsDesc"),
    },
    {
      icon: Key,
      title: t("protocols.apiKeys"),
      description: t("protocols.apiKeysDesc"),
    },
  ];

  const useCases = [
    {
      icon: Cpu,
      title: t("useCases.microservices"),
      description: t("useCases.microservicesDesc"),
    },
    {
      icon: AppWindow,
      title: t("useCases.apiGateway"),
      description: t("useCases.apiGatewayDesc"),
    },
    {
      icon: Bot,
      title: t("useCases.cicd"),
      description: t("useCases.cicdDesc"),
    },
    {
      icon: Cloud,
      title: t("useCases.serverless"),
      description: t("useCases.serverlessDesc"),
    },
  ];

  const sampleCode = [
    {
      language: "typescript",
      filename: "auth.ts",
      code: `import { AetherClient } from '@aether-identity/node';

const aether = new AetherClient({
  domain: 'auth.yourcompany.com',
  clientId: process.env.AETHER_CLIENT_ID,
  clientSecret: process.env.AETHER_CLIENT_SECRET,
});

// Request machine token
const token = await aether.getToken({
  scope: 'read:documents write:documents',
});

// Use token for API calls
const response = await fetch('https://api.yourcompany.com/data', {
  headers: { 'Authorization': \`Bearer \${token.access_token}\` },
});`,
    },
    {
      language: "python",
      filename: "auth.py",
      code: `from aether_client import AetherClient

aether = AetherClient(
    domain='auth.yourcompany.com',
    client_id=os.environ['AETHER_CLIENT_ID'],
    client_secret=os.environ['AETHER_CLIENT_SECRET'],
)

# Request machine token
token = await aether.get_token(
    scope='read:documents write:documents'
)

# Use token for API calls
response = requests.get(
    'https://api.yourcompany.com/data',
    headers={'Authorization': f'Bearer {token.access_token}'}
)`,
    },
  ];

  const comparison = [
    { feature: "Self-hosted", aether: true, keycloak: true, auth0: false, okta: false },
    { feature: "Client Credentials flow", aether: true, keycloak: true, auth0: true, okta: true },
    { feature: "mTLS support", aether: true, keycloak: true, auth0: false, okta: true },
    {
      feature: "Service mesh integration",
      aether: true,
      keycloak: false,
      auth0: false,
      okta: false,
    },
    { feature: "API key management", aether: true, keycloak: true, auth0: true, okta: true },
    { feature: "Token introspection", aether: true, keycloak: true, auth0: true, okta: true },
    { feature: "No vendor lock-in", aether: true, keycloak: true, auth0: false, okta: false },
    { feature: "SLA guarantee", aether: "99.99%", keycloak: "N/A", auth0: "99.9%", okta: "99.9%" },
  ];

  const integrations = [
    { name: "Kubernetes", category: "Orchestration" },
    { name: "Istio", category: "Service Mesh" },
    { name: "Linkerd", category: "Service Mesh" },
    { name: "NGINX", category: "API Gateway" },
    { name: "Kong", category: "API Gateway" },
    { name: "Envoy", category: "Proxy" },
    { name: "Terraform", category: "Infrastructure" },
    { name: "AWS", category: "Cloud" },
    { name: "Azure", category: "Cloud" },
    { name: "GCP", category: "Cloud" },
  ];

  const faqs = [
    {
      question: t("faq.diffUser.title"),
      answer: t("faq.diffUser.answer"),
    },
    {
      question: t("faq.internalExternal.title"),
      answer: t("faq.internalExternal.answer"),
    },
    {
      question: t("faq.certRotation.title"),
      answer: t("faq.certRotation.answer"),
    },
    {
      question: t("faq.serviceAccounts.title"),
      answer: t("faq.serviceAccounts.answer"),
    },
    {
      question: t("faq.jwtValidation.title"),
      answer: t("faq.jwtValidation.answer"),
    },
  ];

  const resources = [
    {
      icon: FileText,
      title: t("resources.documentation"),
      description: t("resources.documentationDesc"),
    },
    {
      icon: BookOpen,
      title: t("resources.tutorial"),
      description: t("resources.tutorialDesc"),
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

  const securityStandards = ["SOC 2 Type II", "GDPR", "ISO 27001", "HIPAA"];

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

        {/* Protocol Support */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("protocols.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("protocols.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {protocols.map((protocol) => (
                <div
                  key={protocol.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <protocol.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{protocol.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {protocol.description}
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
                      {t("compare.keycloak")}
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      {t("compare.auth0")}
                    </th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">
                      {t("compare.okta")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.feature} className="border-b border-border/50">
                      <td className="py-4 px-4 text-sm text-foreground">{row.feature}</td>
                      <td className="py-4 px-4 text-center">
                        {typeof row.aether === "boolean" ? (
                          row.aether ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm font-medium text-foreground">{row.aether}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.keycloak === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                        ) : row.keycloak === false ? (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        ) : (
                          <span className="text-sm text-muted-foreground">{row.keycloak}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.auth0 === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                        ) : row.auth0 === false ? (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        ) : (
                          <span className="text-sm text-muted-foreground">{row.auth0}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.okta === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                        ) : row.okta === false ? (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
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
                    {integrations.map((integration) => (
                      <span
                        key={integration.name}
                        className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80"
                      >
                        {integration.name}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase) => (
                <div
                  key={useCase.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <useCase.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                  {t("security.title")}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  {t("security.description")}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {securityStandards.map((standard) => (
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
                    {t("security.encryptionRest")}
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Lock className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">TLS 1.3</div>
                  <div className="text-sm text-muted-foreground">
                    {t("security.encryptionTransit")}
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Gauge className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">
                    {t("security.rateLimiting")}
                  </div>
                  <div className="text-sm text-muted-foreground">{t("security.rateLimitDesc")}</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Layers className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">
                    {t("security.auditLogs")}
                  </div>
                  <div className="text-sm text-muted-foreground">{t("security.completeTrail")}</div>
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
