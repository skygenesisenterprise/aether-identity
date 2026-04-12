import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
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
  Terminal,
  GitBranch,
  Database,
  Cloud,
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
    description: "Full control over your identity infrastructure with air-gapped deployment support.",
  },
  {
    icon: Cloud,
    title: "Cloud Native",
    description: "Kubernetes-ready with Helm charts, horizontal scaling, and cloud provider integrations.",
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

const complianceStandards = [
  "SOC 2 Type II",
  "GDPR",
  "HIPAA",
  "ISO 27001",
  "PCI DSS",
  "FedRAMP Ready",
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
                    <Terminal className="h-4 w-4" />
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
                <div className="mt-8 flex flex-wrap gap-2">
                  {sdkSupport.map((sdk) => (
                    <span
                      key={sdk.name}
                      className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80"
                    >
                      {sdk.name}
                    </span>
                  ))}
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
                <div className="bg-background/5 rounded-lg border border-background/10 p-6 font-mono text-sm">
                  <div className="flex items-center gap-2 text-background/50 mb-4">
                    <span className="w-3 h-3 rounded-full bg-background/20" />
                    <span className="w-3 h-3 rounded-full bg-background/20" />
                    <span className="w-3 h-3 rounded-full bg-background/20" />
                    <span className="ml-2">auth.ts</span>
                  </div>
                  <pre className="text-background/80 overflow-x-auto">
                    <code>{`import { AetherClient } from '@aether-identity/node';

const aether = new AetherClient({
  domain: 'auth.yourcompany.com',
  clientId: process.env.AETHER_CLIENT_ID,
});

// Verify access token
const { user, permissions } = await aether.verify(
  request.headers.authorization
);

// Check specific permission
if (permissions.includes('read:documents')) {
  // Authorized access
}`}</code>
                  </pre>
                </div>
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
                Whether you need complete isolation, cloud scalability, or a hybrid approach,
                Aether Identity adapts to your infrastructure requirements.
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
