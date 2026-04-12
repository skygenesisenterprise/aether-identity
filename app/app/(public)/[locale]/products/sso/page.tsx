import Link from "next/link";
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
  {
    icon: Globe,
    title: "Universal Single Sign-On",
    description:
      "Authenticate once, access everything. Seamless SSO across web, mobile, and desktop applications with zero friction.",
  },
  {
    icon: Lock,
    title: "Enterprise Identity Protocols",
    description:
      "Full support for SAML 2.0, OAuth 2.0, and OpenID Connect. Integrate with any identity provider or application.",
  },
  {
    icon: Fingerprint,
    title: "Adaptive Multi-Factor Authentication",
    description:
      "Risk-based MFA with TOTP, WebAuthn, SMS, email, and push notifications. Step-up authentication when needed.",
  },
  {
    icon: Users,
    title: "Centralized User Management",
    description:
      "Unified user directory with group synchronization, attribute mapping, and role-based access control.",
  },
  {
    icon: Layers,
    title: "Application Gateway",
    description:
      "Reverse proxy with integrated authentication for legacy apps. Protect internal services without code changes.",
  },
  {
    icon: RefreshCw,
    title: "Session Federation",
    description:
      "Shared session state across applications. One login propagates everywhere instantly.",
  },
];

const features = [
  {
    title: "SAML SP & IdP",
    description: "Act as both Service Provider and Identity Provider",
    tags: ["SAML 2.0", "IdP-Initiated", "SP-Initiated"],
  },
  {
    title: "OAuth 2.0 / OIDC",
    description: "Modern authorization with full protocol support",
    tags: ["Authorization Code", "PKCE", "Client Credentials"],
  },
  {
    title: "Identity Brokering",
    description: "Connect multiple external IdPs through one gateway",
    tags: ["SAML", "OIDC", "LDAP", "Social"],
  },
  {
    title: "Attribute Mapping",
    description: "Transform user data between identity systems",
    tags: ["JSONata", "XSLT", "Static Values"],
  },
  {
    title: "Trust Chain Management",
    description: "Configure and manage trusted identity relationships",
    tags: ["Metadata Import", "Certificate Rotation", "Entity Descriptors"],
  },
  {
    title: "Audit & Compliance",
    description: "Complete logging of all authentication events",
    tags: ["SIEM Integration", "Compliance Reports", "Real-time Alerts"],
  },
];

const metrics = [
  { value: "< 10ms", label: "SSO redirect latency" },
  { value: "99.99%", label: "Service availability" },
  { value: "500+", label: "App integrations" },
  { value: "Zero", label: "Downtime in 24 months" },
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
  { feature: "Self-hosted SSO", aether: true, okta: false, auth0: false, azure: false },
  { feature: "SAML 2.0 Support", aether: true, okta: true, auth0: true, azure: true },
  { feature: "OIDC / OAuth 2.0", aether: true, okta: true, auth0: true, azure: true },
  { feature: "Identity Brokering", aether: true, okta: true, auth0: true, azure: true },
  { feature: "Application Gateway", aether: true, okta: false, auth0: false, azure: true },
  { feature: "Custom IdP Plugins", aether: true, okta: false, auth0: false, azure: false },
  { feature: "No per-user pricing", aether: true, okta: false, auth0: false, azure: false },
];

const faqs = [
  {
    question: "How does Aether SSO differ from Auth0 or Okta?",
    answer:
      "Aether SSO is self-hosted, giving you complete control over your identity infrastructure. Unlike cloud services, there are no per-user fees, and your data never leaves your network. It's ideal for organizations with strict data sovereignty requirements.",
  },
  {
    question: "Can Aether federate with multiple identity providers?",
    answer:
      "Yes, Aether supports identity brokering - you can connect multiple IdPs (Okta, Azure AD, Ping Identity, etc.) and present a unified authentication interface to your applications.",
  },
  {
    question: "Does Aether work with legacy applications?",
    answer:
      "Yes, the built-in application gateway can protect any HTTP-based application without requiring code changes. It handles session management and can even bridge between SAML and OAuth.",
  },
  {
    question: "How do I migrate from an existing SSO solution?",
    answer:
      "We provide migration tooling for Okta, Auth0, and Azure AD. Our team can assist with metadata transfer, attribute mapping, and testing to ensure a smooth transition.",
  },
  {
    question: "Is there a limit on the number of applications?",
    answer:
      "No, Aether has no application limits. You can register as many SP or IdP connections as needed. The limiting factor is your infrastructure capacity.",
  },
];

export default async function SSOPage({ params }: { params: Promise<{ locale: string }> }) {
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
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                Enterprise SSO
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Universal Single Sign-On for Your Infrastructure
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Connect all your applications through a unified authentication gateway. SAML, OAuth,
                and OpenID Connect with full protocol support and zero vendor lock-in.
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

        {/* Core Capabilities */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Everything You Need for Enterprise SSO
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Comprehensive identity federation that works with your existing infrastructure and
                scales with your organization.
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

        {/* Protocol Features */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Protocol Support
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Industry-standard protocols for maximum compatibility with your existing
                applications and identity providers.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feature.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">How We Compare</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                See why organizations choose Aether SSO over cloud-only alternatives.
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
                  Integrate in Minutes
                </h2>
                <p className="mt-4 text-lg text-background/70 leading-relaxed">
                  Simple SDKs and standard protocols make integration straightforward. Configure
                  once, authenticate everywhere.
                </p>
                <div className="mt-8">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      SAML 2.0
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      OAuth 2.0
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      OpenID Connect
                    </span>
                    <span className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80">
                      WS-Federation
                    </span>
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/docs/quickstarts">
                    <Button variant="secondary" size="lg" className="gap-2">
                      <Zap className="h-4 w-4" />
                      Quickstart Guides
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
                Common Use Cases
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Flexible architecture handles even the most complex identity scenarios.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-border bg-card">
                <Key className="h-8 w-8 text-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Multi-IdP Aggregation
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Aggregate multiple identity providers (Azure AD, Okta, custom IdPs) into a single
                  authentication point for all your applications.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <Layers className="h-8 w-8 text-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Legacy App Protection
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Add authentication to applications that don't support modern protocols using the
                  built-in reverse proxy gateway.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <Building2 className="h-8 w-8 text-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">B2B Partner Access</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enable secure partner authentication via SAML federation. Control partner access
                  without managing external users.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <HeadphonesIcon className="h-8 w-8 text-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Multi-Region Deployment
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Deploy SSO nodes across regions with shared session state for global workforce
                  access with low latency.
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
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Common questions about Aether SSO.
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
                Ready to Modernize Your SSO?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Deploy Aether SSO and gain complete control over your authentication infrastructure.
                Open source, self-hosted, enterprise-ready.
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
