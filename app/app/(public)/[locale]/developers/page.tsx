import Link from "next/link";
import { getTranslations } from "next-intl/server";
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
  Key,
} from "lucide-react";

const languages = [
  { name: "Node.js", icon: "node", version: "v3.0.0", popularityKey: "backendSdks.nodePopular" },
  { name: "Python", icon: "python", version: "v2.8.0", popularityKey: "backendSdks.pythonPopular" },
  { name: "Go", icon: "go", version: "v1.5.0", popularityKey: "backendSdks.goPopular" },
  { name: "Java", icon: "java", version: "v2.3.0", popularityKey: "" },
  { name: ".NET", icon: "dotnet", version: "v2.1.0", popularityKey: "" },
  { name: "Rust", icon: "rust", version: "v1.0.0", popularityKey: "" },
];

const frontendSdks = [
  { name: "React", descriptionKey: "frontendSdks.reactDesc" },
  { name: "Vue", descriptionKey: "frontendSdks.vueDesc" },
  { name: "Angular", descriptionKey: "frontendSdks.angularDesc" },
  { name: "Svelte", descriptionKey: "frontendSdks.svelteDesc" },
];

const mobileSdks = [
  { name: "iOS (Swift)", descriptionKey: "mobileSdks.iosDesc" },
  { name: "Android (Kotlin)", descriptionKey: "mobileSdks.androidDesc" },
  { name: "React Native", descriptionKey: "mobileSdks.reactNativeDesc" },
  { name: "Flutter", descriptionKey: "mobileSdks.flutterDesc" },
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

const integrationTools = [
  {
    icon: Container,
    titleKey: "deployment.docker",
    descriptionKey: "deployment.dockerDesc",
    link: "/docs/installation/docker",
  },
  {
    icon: Layers3,
    titleKey: "deployment.kubernetes",
    descriptionKey: "deployment.kubernetesDesc",
    link: "/docs/installation/kubernetes",
  },
  {
    icon: Cloud,
    titleKey: "deployment.cloud",
    descriptionKey: "deployment.cloudDesc",
    link: "/docs/installation/cloud",
  },
  {
    icon: Server,
    titleKey: "deployment.baremetal",
    descriptionKey: "deployment.baremetalDesc",
    link: "/docs/installation/binary",
  },
];

const frameworks: string[] = [];

const tools = [
  { nameKey: "tools.cli", descriptionKey: "tools.cliDesc" },
  { nameKey: "tools.terraform", descriptionKey: "tools.terraformDesc" },
  { nameKey: "tools.prometheus", descriptionKey: "tools.prometheusDesc" },
  { nameKey: "tools.grafana", descriptionKey: "tools.grafanaDesc" },
];

const protocols = [
  { nameKey: "protocols.oauth", descriptionKey: "protocols.oauthDesc" },
  { nameKey: "protocols.oidc", descriptionKey: "protocols.oidcDesc" },
  { nameKey: "protocols.saml", descriptionKey: "protocols.samlDesc" },
  { nameKey: "protocols.ldap", descriptionKey: "protocols.ldapDesc" },
  { nameKey: "protocols.webauthn", descriptionKey: "protocols.webauthnDesc" },
  { nameKey: "protocols.scim", descriptionKey: "protocols.scimDesc" },
];

const resources = [
  {
    icon: BookOpen,
    title: "resources.documentation",
    description: "resources.documentationDesc",
  },
  {
    icon: FileCode,
    title: "resources.codeExamples",
    description: "resources.codeExamplesDesc",
  },
  {
    icon: Terminal,
    title: "resources.interactiveApi",
    description: "resources.interactiveApiDesc",
  },
  {
    icon: Hexagon,
    title: "resources.sdkSource",
    description: "resources.sdkSourceDesc",
  },
];

export default async function DevelopersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Developers" });

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
                <Link href={`/${locale}/docs/quickstarts`}>
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    {t("hero.ctaQuickstart")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/${locale}/docs/api-reference`}>
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    <Terminal className="h-4 w-4" />
                    {t("hero.ctaApiRef")}
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
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("backendSdks.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("backendSdks.description")}
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
                  {lang.popularityKey && (
                    <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded">
                      {t(lang.popularityKey)}
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
                  {t("installation.title")}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  {t("installation.description")}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {[
                    t("installation.typescript"),
                    t("installation.esm"),
                    t("installation.cjs"),
                    t("installation.deno"),
                  ].map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1.5 text-sm bg-muted rounded-md text-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="mt-8">
                  <Link href={`/${locale}/docs/sdks/backend`}>
                    <Button variant="secondary" size="lg" className="gap-2">
                      <Package className="h-4 w-4" />
                      {t("installation.cta")}
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
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("frontendSdks.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("frontendSdks.description")}
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
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(sdk.descriptionKey)}
                  </p>
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
                  {t("quickstart.title")}
                </h2>
                <p className="mt-4 text-lg text-background/70 leading-relaxed">
                  {t("quickstart.description")}
                </p>
                <div className="mt-8">
                  <Link href={`/${locale}/docs/quickstarts`}>
                    <Button variant="secondary" size="lg" className="gap-2">
                      <Zap className="h-4 w-4" />
                      {t("quickstart.cta")}
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
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("mobileSdks.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("mobileSdks.description")}
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
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(sdk.descriptionKey)}
                  </p>
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
                {t("features.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("features.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Zap,
                  title: t("features.performance"),
                  description: t("features.performanceDesc"),
                },
                {
                  icon: Shield,
                  title: t("features.security"),
                  description: t("features.securityDesc"),
                },
                { icon: Key, title: t("features.oauth"), description: t("features.oauthDesc") },
                {
                  icon: Settings,
                  title: t("features.migration"),
                  description: t("features.migrationDesc"),
                },
              ].map((feature) => (
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
                {t("frameworks.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("frameworks.description")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                t("frameworks.nextjs"),
                t("frameworks.remix"),
                t("frameworks.nuxt"),
                t("frameworks.express"),
                t("frameworks.fastify"),
                t("frameworks.nestjs"),
                t("frameworks.django"),
                t("frameworks.fastapi"),
                t("frameworks.gin"),
                t("frameworks.echo"),
              ].map((framework) => (
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
                {t("deployment.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("deployment.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {integrationTools.map((tool) => (
                <Link
                  key={tool.titleKey}
                  href={`${locale}${tool.link}`}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors group"
                >
                  <tool.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:underline">
                    {t(tool.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(tool.descriptionKey)}
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
                  {t("verify.title")}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  {t("verify.description")}
                </p>
                <div className="mt-8 space-y-3">
                  {[t("verify.typeSafe"), t("verify.autoRefresh"), t("verify.errorHandling")].map(
                    (item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    )
                  )}
                </div>
                <div className="mt-8">
                  <Link href={`/${locale}/docs/api-reference`}>
                    <Button variant="secondary" size="lg" className="gap-2">
                      <BookOpen className="h-4 w-4" />
                      {t("verify.cta")}
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
                {t("protocols.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("protocols.description")}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {protocols.map((protocol) => (
                <div
                  key={protocol.nameKey}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card"
                >
                  <Workflow className="h-5 w-5 text-foreground shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">{t(protocol.nameKey)}</div>
                    <div className="text-sm text-muted-foreground">
                      {t(protocol.descriptionKey)}
                    </div>
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
                {t("tools.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("tools.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tools.map((tool) => (
                <div
                  key={tool.nameKey}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <Settings className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{t(tool.nameKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(tool.descriptionKey)}
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
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t(resource.title)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(resource.description)}
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
                <Link href={`/${locale}/company/contact`}>
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    {t("cta.startBuilding")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/${locale}/docs`}>
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    {t("cta.browseDocs")}
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
