import Link from "next/link";
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

const capabilities = [
  {
    icon: Key,
    title: "Client Credentials Flow",
    description:
      "OAuth 2.0 Client Credentials flow for secure machine-to-machine authentication with automatic token refresh.",
  },
  {
    icon: Shield,
    title: "API Key Management",
    description:
      "Generate, rotate, and manage API keys with granular scopes and expiration policies.",
  },
  {
    icon: Network,
    title: "Service Mesh Integration",
    description:
      "Native integration with Istio, Linkerd, and Consul for zero-trust service communication.",
  },
  {
    icon: Lock,
    title: "Mutual TLS (mTLS)",
    description:
      "Certificate-based authentication with automated certificate rotation and trust management.",
  },
  {
    icon: Server,
    title: "Self-Hosted Infrastructure",
    description:
      "Deploy on your infrastructure with Docker, Kubernetes, or bare metal. Your data stays under your control.",
  },
  {
    icon: Workflow,
    title: "Token Introspection",
    description:
      "Real-time token validation and introspection for stateless authorization decisions.",
  },
];

const metrics = [
  { value: "< 5ms", label: "Token issuance latency" },
  { value: "100K+", label: "Requests per second" },
  { value: "99.99%", label: "SLA availability" },
  { value: "Zero", label: "Vendor lock-in" },
];

const protocols = [
  {
    icon: Lock,
    title: "OAuth 2.0",
    description:
      "Client Credentials, JWT Bearer, and refresh token flows for secure service authentication.",
  },
  {
    icon: Shield,
    title: "OpenID Connect",
    description:
      "Service account discovery and standardized token claims for inter-service identity.",
  },
  {
    icon: Network,
    title: "mTLS",
    description: "Mutual TLS with automated certificate lifecycle management and mesh integration.",
  },
  {
    icon: Key,
    title: "API Keys",
    description: "Revocable API keys with scoped permissions and automatic rotation support.",
  },
];

const useCases = [
  {
    icon: Cpu,
    title: "Microservices Authentication",
    description:
      "Secure inter-service communication with fine-grained access control and audit trails.",
  },
  {
    icon: AppWindow,
    title: "API Gateway Security",
    description: "Centralized authentication and authorization at the API gateway layer.",
  },
  {
    icon: Bot,
    title: "CI/CD Pipeline Access",
    description:
      "Secure authentication for build systems, deployment pipelines, and automation tools.",
  },
  {
    icon: Cloud,
    title: "Serverless Functions",
    description: "Lightweight authentication for AWS Lambda, Azure Functions, and Cloud Functions.",
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
  { feature: "Service mesh integration", aether: true, keycloak: false, auth0: false, okta: false },
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
    question: "How does M2M authentication differ from user authentication?",
    answer:
      "Machine-to-machine authentication uses service accounts and client credentials instead of user credentials. Tokens are typically shorter-lived and don't require user interaction for refresh.",
  },
  {
    question: "Can I use M2M authentication for both internal and external APIs?",
    answer:
      "Yes, Aether supports both internal service-to-service communication and external API authentication with appropriate scope restrictions and rate limiting.",
  },
  {
    question: "How do you handle certificate rotation for mTLS?",
    answer:
      "Aether automatically rotates certificates before expiration using the SPIFFE standard. This requires zero downtime and no manual intervention.",
  },
  {
    question: "Is there a limit on the number of service accounts?",
    answer:
      "No, Aether supports unlimited service accounts. You can create as many as needed for your microservices architecture.",
  },
  {
    question: "Do you support JWT validation for offline verification?",
    answer:
      "Yes, Aether issues signed JWTs that can be validated offline using public keys, eliminating the need for network calls during authorization.",
  },
];

const resources = [
  {
    icon: FileText,
    title: "Documentation",
    description: "M2M Authentication Setup Guide",
  },
  {
    icon: BookOpen,
    title: "Tutorial",
    description: "Securing Microservices with mTLS",
  },
  {
    icon: Calendar,
    title: "Webinar",
    description: "Zero-Trust Architecture for Services",
  },
  {
    icon: BarChart3,
    title: "Case Study",
    description: "How FinTech Corp Secured 500+ Services",
  },
];

export default async function M2MPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

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
                Machine-to-Machine Identity
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Secure Service-to-Service Authentication
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Enterprise-grade machine identity management with OAuth 2.0, mTLS, and seamless
                integration into your microservices architecture.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link href="/docs">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    View Documentation
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="https://github.com/skygenesisenterprise/aether-identity">
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    <GitHubIcon className="h-4 w-4" />
                    GitHub Repository
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
                Protocol Support
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Industry-standard protocols for machine identity with flexible deployment options.
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
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">How We Compare</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                See why leading organizations choose Aether for machine-to-machine authentication.
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
                  Integrate in Minutes, Not Weeks
                </h2>
                <p className="mt-4 text-lg text-background/70 leading-relaxed">
                  Our SDKs handle token acquisition, refresh, and validation so you can focus on
                  your application logic.
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
                      Quickstart Guides
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
                Core Capabilities
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Built for high-scale service authentication with enterprise-grade security and
                observability.
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
                Common Use Cases
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Aether handles authentication for diverse machine-to-machine scenarios at any scale.
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
                  Enterprise Security
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Built with security-first architecture to meet the most demanding compliance
                  requirements.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">SOC 2 Type II</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">GDPR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">ISO 27001</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-sm text-foreground">HIPAA</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Shield className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">AES-256</div>
                  <div className="text-sm text-muted-foreground">Encryption at rest</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Lock className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">TLS 1.3</div>
                  <div className="text-sm text-muted-foreground">Encryption in transit</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Gauge className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Rate Limiting</div>
                  <div className="text-sm text-muted-foreground">Per-service limits</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Layers className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Audit Logs</div>
                  <div className="text-sm text-muted-foreground">Complete trail</div>
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
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Common questions about machine-to-machine authentication.
              </p>
            </div>
            <FaqAccordion faqs={faqs} />
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">Resources</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Explore our documentation, guides, and technical resources.
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
                Secure Your Machine Identity Today
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Deploy Aether Identity for M2M authentication and eliminate credential management
                headaches. Open source, self-hosted, enterprise-ready.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/docs">
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    Contact Sales
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
