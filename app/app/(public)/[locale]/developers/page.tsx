import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/public/CodeBlock";
import {
  Code2,
  Terminal,
  Package,
  BookOpen,
  Zap,
  Shield,
  GitBranch,
  Layers,
  ArrowRight,
  CheckCircle2,
  Box,
  FileCode,
  Settings,
  ChevronRight,
  Hexagon,
  Layers3,
  Workflow,
  Container,
  Server,
  Cloud,
} from "lucide-react";

const languages = [
  { name: "Node.js", icon: "node", version: "v3.0.0", popularity: "Popular" },
  { name: "Python", icon: "python", version: "v2.8.0", popularity: "Popular" },
  { name: "Go", icon: "go", version: "v1.5.0", popularity: "Popular" },
  { name: "Java", icon: "java", version: "v2.3.0", popularity: "" },
  { name: ".NET", icon: "dotnet", version: "v2.1.0", popularity: "" },
  { name: "Rust", icon: "rust", version: "v1.0.0", popularity: "" },
];

const frontendSdks = [
  { name: "React", description: "Hooks, providers, and components for React applications" },
  { name: "Vue", description: "Composition API integration for Vue 3 applications" },
  { name: "Angular", description: "Modules and services for Angular applications" },
  { name: "Svelte", description: "Lightweight SDK for Svelte and SvelteKit" },
];

const mobileSdks = [
  { name: "iOS (Swift)", description: "Native Swift SDK for iOS, macOS, and tvOS" },
  { name: "Android (Kotlin)", description: "Kotlin-first SDK for Android applications" },
  { name: "React Native", description: "Cross-platform SDK for React Native apps" },
  { name: "Flutter", description: "Dart SDK for Flutter cross-platform development" },
];

const sampleCode = [
  {
    language: "typescript",
    filename: "installation.ts",
    code: `npm install @aether-identity/node`,
  },
  {
    language: "python",
    filename: "installation.py",
    code: `pip install aether-identity`,
  },
];

const quickstartCode = [
  {
    language: "typescript",
    filename: "auth-client.ts",
    code: `import { AetherClient } from '@aether-identity/node';

const client = new AetherClient({
  domain: 'https://auth.yourcompany.com',
  clientId: process.env.AETHER_CLIENT_ID,
  clientSecret: process.env.AETHER_CLIENT_SECRET,
});

const { user, session } = await client.authenticate({
  email: 'user@example.com',
  password: 'secure-password',
});`,
  },
];

const apiExampleCode = [
  {
    language: "typescript",
    filename: "api-usage.ts",
    code: `import { AetherClient } from '@aether-identity/node';

const client = new AetherClient({
  domain: 'https://auth.yourcompany.com',
  clientId: process.env.AETHER_CLIENT_ID,
  clientSecret: process.env.AETHER_CLIENT_SECRET,
});

const { user, permissions } = await client.verify(
  request.headers.authorization
);

if (permissions.includes('admin:access')) {
  // Grant admin access
}`,
  },
];

const features = [
  {
    icon: Zap,
    title: "Sub-15ms Token Validation",
    description:
      "High-performance token verification with optimized caching and connection pooling for minimal latency.",
  },
  {
    icon: Shield,
    title: "Built-in Security",
    description:
      "Automatic CSRF protection, input validation, and secure defaults for every integration.",
  },
  {
    icon: Layers,
    title: "Full OAuth 2.0 Suite",
    description:
      "Support for authorization code, PKCE, client credentials, refresh tokens, and device flows.",
  },
  {
    icon: GitBranch,
    title: "Easy Migration",
    description:
      "Import existing users and configurations from Auth0, Okta, or any OAuth provider.",
  },
];

const integrationTools = [
  {
    icon: Container,
    title: "Docker",
    description: "Official Docker images with multi-stage builds",
    link: "/docs/installation/docker",
  },
  {
    icon: Layers3,
    title: "Kubernetes",
    description: "Helm charts and operator for K8s deployments",
    link: "/docs/installation/kubernetes",
  },
  {
    icon: Cloud,
    title: "Cloud Providers",
    description: "One-click deployment to AWS, GCP, Azure",
    link: "/docs/installation/cloud",
  },
  {
    icon: Server,
    title: "Bare Metal",
    description: "Binary releases for any Linux server",
    link: "/docs/installation/binary",
  },
];

const frameworks = [
  "Next.js",
  "Remix",
  "Nuxt",
  "Express",
  "Fastify",
  "NestJS",
  "Django",
  "FastAPI",
  "Gin",
  "Echo",
];

const tools = [
  { name: "CLI", description: "Command-line interface for management" },
  { name: "Terraform", description: "Infrastructure as Code provider" },
  { name: "Prometheus", description: "Metrics and monitoring exporter" },
  { name: "Grafana", description: "Pre-built dashboard templates" },
];

const protocols = [
  { name: "OAuth 2.0", description: "Authorization framework" },
  { name: "OpenID Connect", description: "Identity layer on top of OAuth 2.0" },
  { name: "SAML 2.0", description: "Enterprise SSO support" },
  { name: "LDAP", description: "Directory integration" },
  { name: "WebAuthn", description: "Passwordless authentication" },
  { name: "SCIM", description: "User provisioning standard" },
];

const resources = [
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Comprehensive guides and API reference",
  },
  {
    icon: FileCode,
    title: "Code Examples",
    description: "Real-world integration patterns",
  },
  {
    icon: Terminal,
    title: "Interactive API",
    description: "Try API endpoints directly",
  },
  {
    icon: Hexagon,
    title: "SDK Source",
    description: "Open source SDK repositories",
  },
];

export default async function DevelopersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-background">
     <Header locale={locale as import("@/lib/locale").Locale} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                Developer Resources
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Build with Aether Identity
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Official SDKs, libraries, and tools to integrate authentication into your
                applications. Get started in minutes with our quickstart guides.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link href="/docs/quickstarts">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    Quickstart Guide
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/docs/api-reference">
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    <Terminal className="h-4 w-4" />
                    API Reference
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SDK Languages */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">Backend SDKs</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Native SDKs for your server-side applications with full type safety and async
                support.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {languages.map((lang) => (
                <div
                  key={lang.name}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5">
                      <Code2 className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{lang.name}</div>
                      <div className="text-sm text-muted-foreground">{lang.version}</div>
                    </div>
                  </div>
                  {lang.popularity && (
                    <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded">
                      {lang.popularity}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Code Example Section */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-balance">
                  Installation in Seconds
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Install via your preferred package manager and start authenticating users in
                  minutes, not hours.
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {["TypeScript", "ESM", "CJS", "Deno"].map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1.5 text-sm bg-muted rounded-md text-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="mt-8">
                  <Link href="/docs/sdks/backend">
                    <Button variant="secondary" size="lg" className="gap-2">
                      <Package className="h-4 w-4" />
                      View All SDKs
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

        {/* Frontend SDKs */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">Frontend SDKs</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Integrate authentication seamlessly into your web applications with our
                framework-specific SDKs.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {frontendSdks.map((sdk) => (
                <div
                  key={sdk.name}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <Box className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{sdk.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{sdk.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quickstart Code */}
        <section className="py-20 lg:py-28 bg-foreground text-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-balance">
                  Simple Authentication Flow
                </h2>
                <p className="mt-4 text-lg text-background/70 leading-relaxed">
                  Our SDKs handle the complexity of OAuth flows while giving you full control over
                  the user experience.
                </p>
                <div className="mt-8">
                  <Link href="/docs/quickstarts">
                    <Button variant="secondary" size="lg" className="gap-2">
                      <Zap className="h-4 w-4" />
                      Full Quickstart
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <CodeBlock samples={quickstartCode} defaultLanguage="typescript" />
              </div>
            </div>
          </div>
        </section>

        {/* Mobile SDKs */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">Mobile SDKs</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Native and cross-platform SDKs for iOS, Android, and hybrid applications.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mobileSdks.map((sdk) => (
                <div
                  key={sdk.name}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <Package className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{sdk.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{sdk.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Why Developers Choose Aether
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Built by developers, for developers. Every SDK is designed with developer experience
                in mind.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <feature.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Supported Frameworks */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Supported Frameworks
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                First-class support for popular frameworks with dedicated documentation and
                examples.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {frameworks.map((framework) => (
                <div
                  key={framework}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card"
                >
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{framework}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Tools */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Deployment Options
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Choose your preferred deployment method. Aether runs anywhere from bare metal to
                serverless.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {integrationTools.map((tool) => (
                <Link
                  key={tool.title}
                  href={tool.link}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors group"
                >
                  <tool.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:underline">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* API Usage Example */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-balance">
                  Verify Tokens with Ease
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Extract user information and permissions from access tokens with a single call.
                </p>
                <div className="mt-8 space-y-3">
                  {["Type-safe responses", "Automatic refresh", "Built-in error handling"].map(
                    (item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    )
                  )}
                </div>
                <div className="mt-8">
                  <Link href="/docs/api-reference">
                    <Button variant="secondary" size="lg" className="gap-2">
                      <BookOpen className="h-4 w-4" />
                      Full API Docs
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <CodeBlock samples={apiExampleCode} defaultLanguage="typescript" />
              </div>
            </div>
          </div>
        </section>

        {/* Supported Protocols */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Supported Protocols
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Industry-standard protocols for maximum compatibility with your existing
                infrastructure.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {protocols.map((protocol) => (
                <div
                  key={protocol.name}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card"
                >
                  <Workflow className="h-5 w-5 text-foreground shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">{protocol.name}</div>
                    <div className="text-sm text-muted-foreground">{protocol.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Developer Tools */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Developer Tools
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Additional tools to enhance your development workflow and operational efficiency.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <Settings className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Everything You Need
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Documentation, examples, and resources to help you succeed with Aether Identity.
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
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Follow our quickstart guide to integrate authentication into your application in
                minutes.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/docs/quickstarts">
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    Start Building
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    Browse Documentation
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
