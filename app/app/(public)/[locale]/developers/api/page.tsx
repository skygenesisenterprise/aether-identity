import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/public/CodeBlock";
import {
  ArrowRight,
  Terminal,
  Key,
  Shield,
  Globe,
  Zap,
  Server,
  Lock,
  Users,
  BookOpen,
  Code2,
  Activity,
  HardDrive,
  ScrollText,
  Gauge,
  CheckCircle2,
} from "lucide-react";

const apiCapabilities = [
  {
    icon: Lock,
    title: "OAuth 2.0 & OIDC",
    description:
      "Full implementation of authorization code, PKCE, client credentials, and refresh token flows with OpenID Connect support.",
  },
  {
    icon: Users,
    title: "User Management",
    description:
      "RESTful endpoints for user CRUD operations, group management, and role assignments with pagination and filtering.",
  },
  {
    icon: Key,
    title: "Token Management",
    description:
      "Issue, validate, refresh, and revoke tokens with configurable lifetimes and scope-based permissions.",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description:
      "Built-in protection against common attacks, comprehensive audit logging, and compliance reporting.",
  },
  {
    icon: Globe,
    title: "Session Control",
    description:
      "Global session management with single sign-on, concurrent session limits, and device tracking.",
  },
  {
    icon: Activity,
    title: "Real-Time Events",
    description:
      "Webhooks and server-sent events for authentication events, user changes, and system alerts.",
  },
];

const endpoints = [
  { method: "POST", path: "/oauth/token", description: "Exchange credentials for tokens" },
  { method: "POST", path: "/oauth/authorize", description: "Initiate authorization flow" },
  { method: "GET", path: "/oauth/userinfo", description: "Retrieve user profile" },
  { method: "POST", path: "/api/users", description: "Create new user" },
  { method: "GET", path: "/api/users/:id", description: "Get user by ID" },
  { method: "PUT", path: "/api/users/:id", description: "Update user details" },
  { method: "DELETE", path: "/api/users/:id", description: "Delete user" },
  { method: "GET", path: "/api/roles", description: "List all roles" },
  { method: "POST", path: "/api/roles", description: "Create new role" },
  { method: "GET", path: "/api/clients", description: "List OAuth clients" },
  { method: "POST", path: "/api/clients", description: "Register new client" },
  { method: "GET", path: "/api/sessions", description: "List active sessions" },
  { method: "DELETE", path: "/api/sessions/:id", description: "Revoke session" },
  { method: "GET", path: "/api/audit/logs", description: "Query audit logs" },
  { method: "GET", path: "/api/health", description: "Health check endpoint" },
];

const sampleCode = [
  {
    language: "typescript",
    filename: "token-request.ts",
    code: `// Exchange authorization code for tokens
const response = await fetch('https://auth.example.com/oauth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
  },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: 'https://myapp.com/callback'
  })
});

const tokens = await response.json();
// { access_token, refresh_token, id_token, expires_in }`,
  },
  {
    language: "curl",
    filename: "user-info.sh",
    code: `curl -X GET "https://auth.example.com/oauth/userinfo" \\
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."`,
  },
];

const authFlows = [
  {
    name: "Authorization Code + PKCE",
    description: "Recommended for web and mobile applications",
    icon: Key,
  },
  {
    name: "Client Credentials",
    description: "Server-to-server authentication",
    icon: Server,
  },
  {
    name: "Refresh Token",
    description: "Long-lived session management",
    icon: RefreshCwIcon,
  },
  {
    name: "Device Flow",
    description: "For CLI tools and IoT devices",
    icon: HardDrive,
  },
];

const limits = [
  { label: "Requests/minute", value: "1,000" },
  { label: "Token validity", value: "1 hour" },
  { label: "Refresh token", value: "30 days" },
  { label: "Max claims", value: "100" },
];

const features = [
  { name: "RESTful API", description: "Predictable URLs and standard HTTP methods" },
  { name: "JSON Responses", description: "Consistent JSON structure across all endpoints" },
  { name: "Pagination", description: "Cursor-based pagination for large datasets" },
  { name: "Filtering", description: "Query parameters for filtering results" },
  { name: "Versioning", description: "API v1 stable, v2 in preview" },
  { name: "OpenAPI", description: "Full OpenAPI 3.0 specification available" },
];

const resources = [
  {
    icon: BookOpen,
    title: "API Reference",
    description: "Complete endpoint documentation",
  },
  {
    icon: ScrollText,
    title: "OpenAPI Spec",
    description: "Download OpenAPI/Swagger definition",
  },
  {
    icon: Terminal,
    title: "Postman Collection",
    description: "Import ready-to-use requests",
  },
  {
    icon: Code2,
    title: "Code Samples",
    description: "Examples in multiple languages",
  },
];

function RefreshCwIcon(props: React.ComponentProps<typeof Zap>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

export default async function DevelopersApiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DevelopersAPI" });

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
                {t("hero.badge")}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                {t("hero.title")}
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                {t("hero.description")}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link href="/docs/api-reference">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    {t("hero.ctaRef")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/developers/postman">
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    <Terminal className="h-4 w-4" />
                    {t("hero.ctaPostman")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* API Capabilities */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
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
              {[
                {
                  icon: Lock,
                  title: t("capabilities.oauth"),
                  description: t("capabilities.oauthDesc"),
                },
                {
                  icon: Users,
                  title: t("capabilities.users"),
                  description: t("capabilities.usersDesc"),
                },
                {
                  icon: Key,
                  title: t("capabilities.tokens"),
                  description: t("capabilities.tokensDesc"),
                },
                {
                  icon: Shield,
                  title: t("capabilities.security"),
                  description: t("capabilities.securityDesc"),
                },
                {
                  icon: Globe,
                  title: t("capabilities.sessions"),
                  description: t("capabilities.sessionsDesc"),
                },
                {
                  icon: Activity,
                  title: t("capabilities.events"),
                  description: t("capabilities.eventsDesc"),
                },
              ].map((capability) => (
                <div key={capability.title} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <capability.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{capability.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {capability.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Endpoints Overview */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("endpoints.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("endpoints.description")}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {endpoints.map((endpoint) => (
                <div
                  key={`${endpoint.method}-${endpoint.path}`}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      endpoint.method === "GET"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : endpoint.method === "POST"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : endpoint.method === "PUT"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <div className="flex-1 min-w-0">
                    <code className="text-sm text-foreground truncate block">{endpoint.path}</code>
                    <p className="text-xs text-muted-foreground truncate">{endpoint.description}</p>
                  </div>
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
                <div className="mt-8 flex flex-wrap gap-2">
                  {["cURL", "Fetch", "Axios", "Requests", "HTTP.rb", "Net::HTTP"].map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1.5 text-sm bg-background/10 rounded-md text-background/80"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
                <div className="mt-8">
                  <Link href="/docs/api-reference">
                    <Button variant="secondary" size="lg" className="gap-2">
                      <BookOpen className="h-4 w-4" />
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

        {/* Authentication Flows */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("flows.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("flows.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Key, name: t("flows.authCode"), description: t("flows.authCodeDesc") },
                {
                  icon: Server,
                  name: t("flows.clientCreds"),
                  description: t("flows.clientCredsDesc"),
                },
                {
                  icon: RefreshCwIcon,
                  name: t("flows.refresh"),
                  description: t("flows.refreshDesc"),
                },
                { icon: HardDrive, name: t("flows.device"), description: t("flows.deviceDesc") },
              ].map((flow) => (
                <div
                  key={flow.name}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <flow.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{flow.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {flow.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                  {t("limits.title")}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  {t("limits.description")}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    { value: "1,000", label: t("limits.rate") },
                    { value: "1 hour", label: t("limits.tokenValidity") },
                    { value: "30 days", label: t("limits.refreshToken") },
                    { value: "100", label: t("limits.maxClaims") },
                  ].map((limit) => (
                    <div key={limit.label} className="p-4 rounded-lg bg-card border border-border">
                      <div className="text-2xl font-semibold text-foreground">{limit.value}</div>
                      <div className="text-sm text-muted-foreground">{limit.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4">
                <div className="p-6 rounded-lg bg-card border border-border">
                  <Gauge className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t("limits.latency")}
                  </h3>
                  <p className="text-sm text-muted-foreground">{t("limits.latencyDesc")}</p>
                </div>
                <div className="p-6 rounded-lg bg-card border border-border">
                  <Zap className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{t("limits.cdn")}</h3>
                  <p className="text-sm text-muted-foreground">{t("limits.cdnDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API Features */}
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
              {[
                { name: t("features.rest"), description: t("features.restDesc") },
                { name: t("features.json"), description: t("features.jsonDesc") },
                { name: t("features.pagination"), description: t("features.paginationDesc") },
                { name: t("features.filtering"), description: t("features.filteringDesc") },
                { name: t("features.versioning"), description: t("features.versioningDesc") },
                { name: t("features.openapi"), description: t("features.openapiDesc") },
              ].map((feature) => (
                <div
                  key={feature.name}
                  className="flex items-start gap-3 p-6 rounded-lg border border-border bg-card"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{feature.name}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-20 lg:py-28">
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
              {[
                {
                  icon: BookOpen,
                  title: t("resources.apiRef"),
                  description: t("resources.apiRefDesc"),
                },
                {
                  icon: ScrollText,
                  title: t("resources.openapi"),
                  description: t("resources.openapiDesc"),
                },
                {
                  icon: Terminal,
                  title: t("resources.postman"),
                  description: t("resources.postmanDesc"),
                },
                {
                  icon: Code2,
                  title: t("resources.samples"),
                  description: t("resources.samplesDesc"),
                },
              ].map((resource) => (
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
                <Link href="/docs/api-reference">
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    {t("cta.ctaRef")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/developers/postman">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    {t("cta.ctaPostman")}
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
