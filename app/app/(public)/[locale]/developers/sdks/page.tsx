import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/public/CodeBlock";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import {
  Code2,
  ArrowRight,
  Box,
  Globe,
  Smartphone,
  Monitor,
  Terminal,
  FileCode,
  BookOpen,
  CheckCircle2,
  Zap,
  Shield,
  Users,
  Layers,
  Cpu,
} from "lucide-react";

const faqs = [
  {
    question: "Which SDK should I use?",
    answer:
      "Choose the SDK matching your application's language and framework. For server-side applications, we recommend Node.js (TypeScript), Go, or Python. For frontend, use React, Vue, or Angular SDKs. For mobile, use iOS or Android SDKs.",
  },
  {
    question: "Do you support other languages?",
    answer:
      "Yes! We have community-maintained SDKs for Ruby, PHP, Rust, and Elixir. Check our GitHub for the full list. Enterprise support is available for our officially maintained SDKs.",
  },
  {
    question: "How do I handle token refresh?",
    answer:
      "All SDKs handle token refresh automatically. The access token is refreshed before expiration using the refresh token. You can configure refresh timing or disable auto-refresh if needed.",
  },
  {
    question: "Can I use multiple SDKs in one app?",
    answer:
      "Absolutely. Many applications use a frontend SDK for SPA authentication and a backend SDK for API authorization. Both share the same Aether domain and user sessions are unified across SDKs.",
  },
  {
    question: "What's included in enterprise support?",
    answer:
      "Enterprise support includes priority bug fixes, dedicated Slack channel, SLA guarantees, custom integrations, and direct access to our engineering team. Contact sales for pricing.",
  },
];

const features = [
  {
    icon: Zap,
    title: "High Performance",
    description: "Sub-15ms token validation with connection pooling and caching.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "PKCE enforcement, encrypted tokens, and automatic rotation.",
  },
  {
    icon: Users,
    title: "User Sync",
    description: "Unified sessions across all SDKs and platforms.",
  },
  {
    icon: BookOpen,
    title: "Well Documented",
    description: "Comprehensive guides, API reference, and migration guides.",
  },
];

export default async function SdksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DevelopersSDKS" });

  const backendSdks = [
    {
      name: t("sdks.nodeName"),
      icon: Box,
      language: "typescript",
      description: t("sdks.nodeDesc"),
      features: t("sdks.nodeFeatures").split(", "),
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
      name: t("sdks.pythonName"),
      icon: Terminal,
      language: "python",
      description: t("sdks.pythonDesc"),
      features: t("sdks.pythonFeatures").split(", "),
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
    {
      name: t("sdks.goName"),
      icon: Cpu,
      language: "go",
      description: t("sdks.goDesc"),
      features: t("sdks.goFeatures").split(", "),
      code: `package aether

import "github.com/aether-identity/go"

aether := go.NewClient(os.Getenv("AETHER_DOMAIN"), &go.Config{
    ClientID:     os.Getenv("AETHER_CLIENT_ID"),
    ClientSecret: os.Getenv("AETHER_CLIENT_SECRET"),
})

// Verify access token
user, perms, err := aether.Verify(ctx, authHeader)
if err != nil {
    return err
}

// Check specific permission
for _, p := range perms {
    if p == "read:documents" {
        // Authorized access
    }
}`,
    },
    {
      name: t("sdks.javaName"),
      icon: FileCode,
      language: "java",
      description: t("sdks.javaDesc"),
      features: t("sdks.javaFeatures").split(", "),
      code: `import com.aetheridentity.AetherClient;
import com.aetheridentity.config.AetherConfig;

@Bean
public AetherClient aetherClient() {
    return AetherClient.builder()
        .domain("auth.yourcompany.com")
        .clientId(clientId)
        .clientSecret(clientSecret)
        .build();
}

// Verify access token
public Mono<User> verify(String authHeader) {
    return client.verify(authHeader)
        .filter(response -> 
            response.getPermissions()
                .contains("read:documents"));
}`,
    },
    {
      name: t("sdks.dotnetName"),
      icon: Layers,
      language: "csharp",
      description: t("sdks.dotnetDesc"),
      features: t("sdks.dotnetFeatures").split(", "),
      code: `using AetherIdentity;

var aether = new AetherClient(new AetherOptions
{
    Domain = "auth.yourcompany.com",
    ClientId = configuration["Aether:ClientId"],
    ClientSecret = configuration["Aether:ClientSecret"]
});

// Verify access token
var (user, permissions) = await aether.VerifyAsync(
    Request.Headers.Authorization
);

// Check specific permission
if (permissions.Contains("read:documents"))
{
    // Authorized access
}`,
    },
  ];

  const frontendSdks = [
    {
      name: t("sdks.reactName"),
      icon: Monitor,
      language: "typescript",
      description: t("sdks.reactDesc"),
      features: t("sdks.reactFeatures").split(", "),
      code: `import { AetherProvider, useAuth } from '@aether-identity/react';

function App() {
  return (
    <AetherProvider domain="auth.yourcompany.com">
      <Dashboard />
    </AetherProvider>
  );
}

function Dashboard() {
  const { user, login, logout } = useAuth();
  
  if (!user) {
    return <button onClick={login}>Sign In</button>;
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}`,
    },
    {
      name: t("sdks.vueName"),
      icon: Globe,
      language: "typescript",
      description: t("sdks.vueDesc"),
      features: t("sdks.vueFeatures").split(", "),
      code: `import { createAether } from '@aether-identity/vue';
import { createPinia } from 'pinia';

const pinia = createPinia();
const aether = createAether({
  domain: 'auth.yourcompany.com',
  clientId: 'your-client-id',
});

const app = createApp(App);
app.use(pinia);
app.use(aether);

const { user, login, logout } = useAether();

async function handleLogin() {
  await login();
}`,
    },
    {
      name: t("sdks.angularName"),
      icon: Layers,
      language: "typescript",
      description: t("sdks.angularDesc"),
      features: t("sdks.angularFeatures").split(", "),
      code: `import { AetherModule } from '@aether-identity/angular';

@NgModule({
  imports: [AetherModule.forRoot({
    domain: 'auth.yourcompany.com',
    clientId: 'your-client-id',
  })],
})
export class AppModule {}

@Component({...})
export class DashboardComponent {
  private auth = inject(AetherService);
  
  user$ = this.auth.user$;
  
  login() {
    this.auth.login();
  }
}`,
    },
  ];

  const mobileSdks = [
    {
      name: t("sdks.iosName"),
      icon: Smartphone,
      language: "swift",
      description: t("sdks.iosDesc"),
      features: t("sdks.iosFeatures").split(", "),
      code: `import AetherIdentity

let aether = AetherClient(
    domain: "auth.yourcompany.com",
    clientId: "your-client-id"
)

// Handle authentication flow
func signIn() async throws -> User {
    let user = try await aether.signIn(
        presenter: self,
        scheme: .ASWebAuthenticationSession
    )
    return user
}`,
    },
    {
      name: t("sdks.androidName"),
      icon: Smartphone,
      language: "kotlin",
      description: t("sdks.androidDesc"),
      features: t("sdks.androidFeatures").split(", "),
      code: `import com.aetheridentity.*

val aether = AetherClient(
    domain = "auth.yourcompany.com",
    clientId = "your-client-id"
)

// Handle authentication flow
suspend fun signIn(): User {
    val user = aether.signIn(
        context = context,
        scheme = AuthScheme.BROWSER
    )
    return user
}`,
    },
  ];

  const faqs = [
    {
      question: t("faq.which.title"),
      answer: t("faq.which.answer"),
    },
    {
      question: t("faq.other.title"),
      answer: t("faq.other.answer"),
    },
    {
      question: t("faq.refresh.title"),
      answer: t("faq.refresh.answer"),
    },
    {
      question: t("faq.multiple.title"),
      answer: t("faq.multiple.answer"),
    },
    {
      question: t("faq.enterprise.title"),
      answer: t("faq.enterprise.answer"),
    },
  ];

  const features = [
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
    {
      icon: Users,
      title: t("features.userSync"),
      description: t("features.userSyncDesc"),
    },
    {
      icon: BookOpen,
      title: t("features.documentation"),
      description: t("features.documentationDesc"),
    },
  ];

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
                    {t("hero.ctaQuickstarts")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/${locale}/docs/api`}>
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    {t("hero.ctaApi")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
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
                {
                  icon: Users,
                  title: t("features.userSync"),
                  description: t("features.userSyncDesc"),
                },
                {
                  icon: BookOpen,
                  title: t("features.documentation"),
                  description: t("features.documentationDesc"),
                },
              ].map((feature) => (
                <div key={feature.title}>
                  <div className="flex items-center gap-3 mb-3">
                    <feature.icon className="h-5 w-5 text-foreground" />
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

        {/* Backend SDKs */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Terminal className="h-4 w-4" />
                {t("backend.title")}
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("backend.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("backend.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {backendSdks.map((sdk) => (
                <div
                  key={sdk.name}
                  className="group rounded-lg border border-border bg-card overflow-hidden"
                >
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                        <sdk.icon className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{sdk.name}</h3>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">
                          {sdk.language}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {sdk.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sdk.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30">
                    <CodeBlock
                      samples={[
                        {
                          language: sdk.language,
                          filename:
                            "auth." +
                            (sdk.language === "typescript" ||
                            sdk.language === "python" ||
                            sdk.language === "go"
                              ? sdk.language === "typescript"
                                ? "ts"
                                : sdk.language === "python"
                                  ? "py"
                                  : "go"
                              : sdk.language === "csharp"
                                ? "cs"
                                : sdk.language === "java"
                                  ? "java"
                                  : "txt"),
                          code: sdk.code,
                        },
                      ]}
                      defaultLanguage={sdk.language}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Frontend SDKs */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Monitor className="h-4 w-4" />
                {t("frontend.title")}
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("frontend.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("frontend.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {frontendSdks.map((sdk) => (
                <div
                  key={sdk.name}
                  className="group rounded-lg border border-border bg-card overflow-hidden"
                >
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                        <sdk.icon className="h-5 w-5 text-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{sdk.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {sdk.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sdk.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30">
                    <CodeBlock
                      samples={[
                        {
                          language: sdk.language,
                          filename: "auth.tsx",
                          code: sdk.code,
                        },
                      ]}
                      defaultLanguage={sdk.language}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mobile SDKs */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Smartphone className="h-4 w-4" />
                {t("mobile.title")}
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("mobile.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("mobile.description")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {mobileSdks.map((sdk) => (
                <div
                  key={sdk.name}
                  className="group rounded-lg border border-border bg-card overflow-hidden"
                >
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                        <sdk.icon className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{sdk.name}</h3>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">
                          {sdk.language}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {sdk.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sdk.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30">
                    <CodeBlock
                      samples={[
                        {
                          language: sdk.language,
                          filename: "AuthView.swift",
                          code: sdk.code,
                        },
                      ]}
                      defaultLanguage={sdk.language}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All SDKs Summary */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("platforms.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("platforms.description")}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                t("platforms.node"),
                t("platforms.python"),
                t("platforms.go"),
                t("platforms.java"),
                t("platforms.dotnet"),
                t("platforms.react"),
                t("platforms.vue"),
                t("platforms.angular"),
                t("platforms.ios"),
                t("platforms.android"),
              ].map((sdk) => (
                <div
                  key={sdk}
                  className="flex items-center justify-center p-4 rounded-lg border border-border bg-card"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2" />
                  <span className="text-sm font-medium text-foreground">{sdk}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href={`/${locale}/docs/quickstarts`}>
                <Button variant="outline" className="gap-2">
                  <Code2 className="h-4 w-4" />
                  {t("platforms.cta")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
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

        {/* CTA Section */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {t("cta.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">{t("cta.description")}</p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={`/${locale}/docs/quickstarts`}>
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    {t("cta.getStarted")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/${locale}/company/contact`}>
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
