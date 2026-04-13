import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { CodeBlock } from "@/components/public/CodeBlock";
import {
  Shield,
  Lock,
  Key,
  Zap,
  ArrowRight,
  Globe,
  Code2,
  Building2,
  CheckCircle2,
  FileText,
  BookOpen,
  Calendar,
  BarChart3,
  Clock,
  X,
  Handshake,
  Workflow,
  Gauge,
  Network,
  UserCheck,
  UsersIcon,
  Briefcase,
  Scale,
  RefreshCw,
  ScrollText,
} from "lucide-react";

const capabilities = [
  {
    icon: Handshake,
    title: "Partner Identity Management",
    description:
      "Secure external access with granular permissions, session controls, and detailed audit trails for all partner interactions.",
  },
  {
    icon: UserCheck,
    title: "External User Authentication",
    description:
      "Dedicated flows for customers, vendors, and contractors with customizable onboarding and enrollment experiences.",
  },
  {
    icon: Key,
    title: "API Access Management",
    description:
      "Fine-grained OAuth 2.0 scopes and token management for machine-to-machine communication and partner integrations.",
  },
  {
    icon: Workflow,
    title: "Delegation & Impersonation",
    description:
      "Allow employees to act on behalf of customers or partners with full audit logging and approval workflows.",
  },
  {
    icon: Globe,
    title: "Cross-Organization SSO",
    description:
      "Federated authentication across partner domains with SAML 2.0 and OIDC federation protocols.",
  },
  {
    icon: Gauge,
    title: "Risk-Based Authentication",
    description:
      "Adaptive policies based on user context, device fingerprint, geolocation, and behavioral analysis.",
  },
];

const metrics = [
  { value: "85%", label: "Reduced onboarding time" },
  { value: "99.99%", label: "SLA availability" },
  { value: "10x", label: "Faster partner integration" },
  { value: "Zero", label: "Vendor lock-in" },
];

const solutions = [
  {
    icon: Briefcase,
    title: "Employee Access",
    description:
      "Secure workforce identity with SSO, MFA, and role-based access across all enterprise applications.",
    features: ["SSO integration", "Device management", "Lifecycle automation"],
  },
  {
    icon: UsersIcon,
    title: "Customer Identity",
    description:
      "Seamless customer experiences with registration, profile management, and preference Centers.",
    features: ["Social login", "Progressive profiling", "Consent management"],
  },
  {
    icon: Handshake,
    title: "Partner Portal",
    description:
      "Controlled partner access with dedicated workspaces, API keys, and usage monitoring.",
    features: ["Partner directories", "API entitlements", "Usage analytics"],
  },
  {
    icon: ScrollText,
    title: "Complete Audit Trail",
    description: "Every access decision logged with full context for compliance and investigation.",
    features: ["Real-time logging", "Compliance reports", "Investigation tools"],
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

// Verify partner access token
const { organization, permissions } = await aether.verify(
  request.headers.authorization,
  { audience: 'partner-portal' }
);

// Check specific partner permission
if (permissions.includes('partners:read')) {
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

# Verify partner access token
organization, permissions = await aether.verify(
    request.headers['authorization'],
    audience='partner-portal'
)

# Check specific partner permission
if 'partners:read' in permissions:
    # Authorized access`,
  },
];

const complianceStandards = [
  "SOC 2 Type II",
  "GDPR",
  "eIDAS",
  "ISO 27001",
  "WCAG 2.1",
  "OpenID Certified",
];

const comparison = [
  { feature: "Multi-tenant", aether: true, keycloak: true, auth0: true, okta: true },
  { feature: "Partner directories", aether: true, keycloak: true, auth0: true, okta: true },
  { feature: "Delegation", aether: true, keycloak: true, auth0: false, okta: true },
  { feature: "API access management", aether: true, keycloak: true, auth0: true, okta: true },
  { feature: "Partner SSO federation", aether: true, keycloak: true, auth0: true, okta: true },
  { feature: "Token exchange", aether: true, keycloak: true, auth0: true, okta: false },
  { feature: "Self-hosted option", aether: true, keycloak: true, auth0: false, okta: false },
];

const benefits = [
  {
    icon: RefreshCw,
    title: "Automated Lifecycle",
    description:
      "Automated provisioning and deprovisioning based on HR systems, contracts, and policy rules.",
  },
  {
    icon: Scale,
    title: "Consistent Governance",
    description:
      "Unified access policies across all user types with centralized visibility and reporting.",
  },
  {
    icon: Network,
    title: "Integration Ready",
    description:
      "Pre-built connectors for Salesforce, SAP, Oracle, and 200+ enterprise applications.",
  },
  {
    icon: ScrollText,
    title: "Complete Audit Trail",
    description: "Every access decision logged with full context for compliance and investigation.",
  },
];

const faqs = [
  {
    question: "How does Aether handle multi-tenant B2B scenarios?",
    answer:
      "Aether provides dedicated namespaces per organization with isolated configurations, branding, and user directories. Cross-organization access is controlled through explicit federation agreements.",
  },
  {
    question: "Can I migrate from Auth0 or Okta B2B solutions?",
    answer:
      "Yes, we provide migration tools and assistance to import your organizations, users, and access configurations. Contact our team for a customized migration plan.",
  },
  {
    question: "What about SLA guarantees for B2B identity?",
    answer:
      "Aether provides 99.99% SLA for enterprise deployments with dedicated support and compensation clauses.",
  },
  {
    question: "Is there a free tier for B2B?",
    answer:
      "Yes, Aether Community Edition supports basic B2B scenarios. For advanced features like delegation and partner federation, contact our sales team.",
  },
  {
    question: "How do you handle regulatory requirements like GDPR?",
    answer:
      "Aether includes built-in consent management, data export, deletion workflows, and processing agreements for GDPR compliance.",
  },
];

const resources = [
  {
    icon: FileText,
    title: "Whitepaper",
    description: "B2B Identity Architecture Guide",
  },
  {
    icon: BookOpen,
    title: "E-book",
    description: "Zero Trust for External Access",
  },
  {
    icon: Calendar,
    title: "Webinar",
    description: "Modern Partner Identity Management",
  },
  {
    icon: BarChart3,
    title: "Case Study",
    description: "How TechCorp Scaled Partner Access",
  },
];

const technicalPartners = [
  { name: "Salesforce" },
  { name: "SAP" },
  { name: "Oracle" },
  { name: "Microsoft" },
  { name: "ServiceNow" },
  { name: "Slack" },
];

const teamMembers = [
  { name: "Alex Chen", role: "CEO & Founder", image: "AC" },
  { name: "Sarah Miller", role: "CTO", image: "SM" },
  { name: "James Wilson", role: "VP Engineering", image: "JW" },
  { name: "Emily Davis", role: "Head of Security", image: "ED" },
];

const recentUpdates = [
  { version: "v2.4.0", date: "March 2026", description: "Partner federation improvements" },
  {
    version: "v2.3.0",
    date: "February 2026",
    description: "Enhanced delegation workflows",
  },
  {
    version: "v2.2.0",
    date: "January 2026",
    description: "API entitlement management",
  },
];

export default async function B2BPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="relative py-24 lg:py-32 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                B2B Identity Solutions
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Identity for Every Business Relationship
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Securely manage employees, customers, partners, and contractors with a unified
                identity platform built for complex B2B ecosystems.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link href="/docs">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    View Documentation
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="h-12 px-6 text-base">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

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

        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Comprehensive B2B Identity
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                A single platform to manage all external identity relationships with the security,
                compliance, and flexibility your business demands.
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

        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Built for All Identity Types
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Tailored workflows and permissions for every type of external access.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {solutions.map((solution) => (
                <div
                  key={solution.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <solution.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{solution.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {solution.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {solution.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28 bg-foreground text-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-balance">
                  Integrate Partner Access in Minutes
                </h2>
                <p className="mt-4 text-lg text-background/70 leading-relaxed">
                  Our SDKs and pre-built connectors make integrating B2B identity into your
                  applications seamless and straightforward.
                </p>
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

        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Enterprise-Grade Benefits
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Built for scale with the security and compliance features enterprises demand.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <benefit.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Compare Solutions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                See how Aether stacks up against other B2B identity providers.
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
                        {row.aether === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                        ) : row.aether === false ? (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
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

        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                  Built for Regulated Industries
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Aether B2B Identity meets the stringent security and compliance requirements of
                  healthcare, finance, and government sectors.
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
                  <div className="text-2xl font-semibold text-foreground">Multi-tenant</div>
                  <div className="text-sm text-muted-foreground">Logical isolation</div>
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

        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Common questions about Aether B2B identity solutions.
              </p>
            </div>
            <FaqAccordion faqs={faqs} />
          </div>
        </section>

        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">Resources</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Explore documentation, guides, and research on B2B identity management.
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

        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Technical Partners
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Seamlessly integrated with the enterprise applications you use.
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
              {technicalPartners.map((partner) => (
                <div key={partner.name} className="text-lg font-semibold text-muted-foreground/60">
                  {partner.name}
                </div>
              ))}
            </div>
          </div>
        </section>

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

        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">Recent Updates</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Stay up to date with the latest B2B features and improvements.
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

        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Secure Every Business Relationship
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Deploy Aether B2B Identity today and unify all your external access under one
                platform.
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
