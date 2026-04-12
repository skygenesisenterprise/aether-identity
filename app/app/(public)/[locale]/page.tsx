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
  Users,
  Key,
  Fingerprint,
  Zap,
  ArrowRight,
  Server,
  Globe,
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
} from "lucide-react";

const capabilities = [
  {
    icon: Lock,
    title: "OAuth 2.0 / OpenID Connect",
    description:
      "Standards-compliant implementation with full support for authorization code, PKCE, client credentials, and refresh token flows.",
  },
  {
    icon: Fingerprint,
    title: "Multi-Factor Authentication",
    description:
      "TOTP, WebAuthn, SMS, and email verification with adaptive risk-based authentication policies.",
  },
  {
    icon: Users,
    title: "User Federation",
    description:
      "Connect existing LDAP, Active Directory, or external identity providers without migrating user credentials.",
  },
  {
    icon: Key,
    title: "Fine-Grained Authorization",
    description:
      "Role-based access control (RBAC) and attribute-based policies with real-time permission evaluation.",
  },
  {
    icon: Server,
    title: "Self-Hosted Infrastructure",
    description:
      "Deploy on your infrastructure with Docker, Kubernetes, or bare metal. Your data stays under your control.",
  },
  {
    icon: Globe,
    title: "Global Session Management",
    description:
      "Distributed session handling with single sign-on across applications and configurable token lifetimes.",
  },
];

const metrics = [
  { value: "< 15ms", label: "Token validation latency" },
  { value: "99.99%", label: "SLA availability" },
  { value: "10M+", label: "Authentications handled" },
  { value: "Zero", label: "Vendor lock-in" },
];

const deploymentOptions = [
  {
    icon: Database,
    title: "On-Premise",
    description:
      "Full control over your identity infrastructure with air-gapped deployment support.",
  },
  {
    icon: Cloud,
    title: "Cloud Native",
    description:
      "Kubernetes-ready with Helm charts, horizontal scaling, and cloud provider integrations.",
  },
  {
    icon: GitBranch,
    title: "Hybrid",
    description: "Bridge on-premise directories with cloud applications through secure federation.",
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
    filename: "auth.ts",
    code: `import { AetherClient } from '@aether-identity/node';

const aether = new AetherClient({
  domain: 'auth.yourcompany.com',
  clientId: process.env.AETHER_CLIENT_ID,
  clientSecret: process.env.AETHER_CLIENT_SECRET,
});

// Verify access token
const { user, permissions } = await aether.verify(
  request.headers.authorization
);

// Check specific permission
if (permissions.includes('read:documents')) {
  // Authorized access
}`,
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

# Verify access token
user, permissions = await aether.verify(
    request.headers['authorization']
)

# Check specific permission
if 'read:documents' in permissions:
    # Authorized access`,
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

const trustedBy = ["Acme Corp", "TechFlow", "SecureBank", "HealthPlus", "GlobalSys", "DataVault"];

const comparison = [
  { feature: "Self-hosted", aether: true, keycloak: true, auth0: false, okta: false },
  { feature: "OAuth 2.0 / OIDC", aether: true, keycloak: true, auth0: true, okta: true },
  { feature: "MFA support", aether: true, keycloak: true, auth0: true, okta: true },
  { feature: "User federation", aether: true, keycloak: true, auth0: true, okta: true },
  { feature: "RBAC/ABAC", aether: true, keycloak: true, auth0: true, okta: true },
  { feature: "Audit logging", aether: true, keycloak: true, auth0: true, okta: true },
  { feature: "No vendor lock-in", aether: true, keycloak: true, auth0: false, okta: false },
  { feature: "SLA guarantee", aether: "99.99%", keycloak: "N/A", auth0: "99.9%", okta: "99.9%" },
];

const industries = [
  {
    icon: HeartPulse,
    title: "Healthcare",
    description:
      "HIPAA-compliant identity management for patient portals, telemedicine, and electronic health records.",
  },
  {
    icon: Landmark,
    title: "Finance",
    description:
      "Secure authentication for banking apps, trading platforms, and regulatory compliance.",
  },
  {
    icon: Building,
    title: "Government",
    description:
      "FedRAMP Ready solutions for citizen services, secure internal networks, and agency collaboration.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description:
      "Seamless customer authentication with fraud prevention and secure payment integration.",
  },
];

const faqs = [
  {
    question: "How does Aether compare to Keycloak?",
    answer:
      "Aether offers a more modern architecture with better performance (<15ms token validation), easier setup, and enterprise support. Unlike Keycloak, Aether provides SLA guarantees and dedicated support.",
  },
  {
    question: "Can I migrate from Auth0 or Okta?",
    answer:
      "Yes, we provide migration tools and assistance to import your users, applications, and configurations from Auth0, Okta, or any other OAuth provider. Contact our team for a customized migration plan.",
  },
  {
    question: "What happens if I lose internet connectivity?",
    answer:
      "Aether supports air-gapped deployments and can operate fully offline. Your authentication services remain functional even without internet access.",
  },
  {
    question: "Is there a free tier?",
    answer:
      "Yes, Aether Community Edition is free and open source. For enterprise features, SLA guarantees, and support, contact our sales team.",
  },
  {
    question: "How often do you release updates?",
    answer:
      "We release monthly security updates and quarterly feature releases. All updates are thoroughly tested and documented.",
  },
];

const resources = [
  {
    icon: FileText,
    title: "Whitepaper",
    description: "Enterprise Identity Architecture Guide",
  },
  {
    icon: BookOpen,
    title: "E-book",
    description: "Zero Trust Security Implementation",
  },
  {
    icon: Calendar,
    title: "Webinar",
    description: "Migrating from Legacy Identity Providers",
  },
  {
    icon: BarChart3,
    title: "Case Study",
    description: "How TechFlow Reduced Auth Latency by 80%",
  },
];

const teamMembers = [
  { name: "Alex Chen", role: "CEO & Founder", image: "AC" },
  { name: "Sarah Miller", role: "CTO", image: "SM" },
  { name: "James Wilson", role: "VP Engineering", image: "JW" },
  { name: "Emily Davis", role: "Head of Security", image: "ED" },
];

const recentUpdates = [
  { version: "v2.4.0", date: "March 2026", description: "WebAuthn support and improved MFA flows" },
  {
    version: "v2.3.0",
    date: "February 2026",
    description: "Enhanced audit logging and compliance reports",
  },
  {
    version: "v2.2.0",
    date: "January 2026",
    description: "Kubernetes operator and Helm chart improvements",
  },
];

export default async function PublicPage({ params }: { params: Promise<{ locale: string }> }) {
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
                Open Source Identity Platform
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Enterprise Identity Infrastructure You Control
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                A self-hosted OAuth 2.0 and OpenID Connect provider built for organizations that
                require complete sovereignty over authentication, authorization, and user data.
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

        {/* Trusted By Section */}
        <section className="py-16 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Trusted by industry leaders
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
              {trustedBy.map((company) => (
                <div key={company} className="text-xl font-semibold text-muted-foreground/60">
                  {company}
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
                Core Capabilities
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Built on open standards with enterprise-grade reliability. Every component is
                designed for extensibility and compliance requirements.
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
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">How We Compare</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                See why leading organizations choose Aether over legacy identity providers.
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
                  Our SDKs abstract the complexity of OAuth flows while giving you full access to
                  underlying primitives when needed.
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

        {/* Deployment Options */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Deploy Your Way
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Whether you need complete isolation, cloud scalability, or a hybrid approach, Aether
                Identity adapts to your infrastructure requirements.
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
                Built for Every Industry
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Specialized identity solutions tailored to the unique security and compliance
                requirements of your sector.
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
                  Built for Regulated Industries
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Aether Identity is designed to meet the stringent security and compliance
                  requirements of healthcare, finance, government, and enterprise organizations.
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
                  <div className="text-sm text-muted-foreground">Encryption at rest</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Lock className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">TLS 1.3</div>
                  <div className="text-sm text-muted-foreground">Encryption in transit</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Building2 className="h-8 w-8 text-foreground mb-3" />
                  <div className="text-2xl font-semibold text-foreground">Air-Gap</div>
                  <div className="text-sm text-muted-foreground">Deployment ready</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <Zap className="h-8 w-8 text-foreground mb-3" />
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
                Common questions about Aether Identity and our enterprise solutions.
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
                Explore our documentation, guides, and latest research on identity security.
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

        {/* Technical Partners */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Technical Partners
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Seamlessly integrated with the tools and platforms you already use.
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
              <div className="text-lg font-semibold text-muted-foreground/60">AWS</div>
              <div className="text-lg font-semibold text-muted-foreground/60">Azure</div>
              <div className="text-lg font-semibold text-muted-foreground/60">Google Cloud</div>
              <div className="text-lg font-semibold text-muted-foreground/60">Kubernetes</div>
              <div className="text-lg font-semibold text-muted-foreground/60">Docker</div>
              <div className="text-lg font-semibold text-muted-foreground/60">Terraform</div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Built by Experts
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Our team brings decades of experience in identity, security, and enterprise
                infrastructure.
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
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">Recent Updates</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Stay up to date with the latest features and improvements.
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
                Take Control of Your Identity Infrastructure
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Deploy Aether Identity today and eliminate dependency on third-party identity
                providers. Open source, self-hosted, enterprise-ready.
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
