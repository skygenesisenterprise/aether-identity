import Link from "next/link";
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

const backendSdks = [
  {
    name: "Node.js",
    icon: Box,
    language: "typescript",
    description:
      "Full-featured SDK for Node.js and Deno. Supports ESM, CommonJS, and TypeScript with full type definitions.",
    features: ["OAuth 2.0 flows", "Token validation", "User management", "MFA support"],
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
    name: "Python",
    icon: Terminal,
    language: "python",
    description:
      "Python SDK with async support. Fully typed with complete API coverage and Django/FastAPI integrations.",
    features: ["Async/await", "Django integration", "FastAPI middleware", "Type hints"],
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
    name: "Go",
    icon: Cpu,
    language: "go",
    description:
      "High-performance Go SDK with context support. Zero dependencies and built for production workloads.",
    features: ["Context support", "Connection pooling", "Zero dependencies", "Native go.mod"],
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
    name: "Java",
    icon: FileCode,
    language: "java",
    description: "Enterprise Java SDK with Spring Boot auto-configuration and Jakarta EE support.",
    features: ["Spring Boot", "Jakarta EE", "Reactive support", "XML/JSON"],
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
    name: ".NET",
    icon: Layers,
    language: "csharp",
    description: ".NET SDK with full async support, LINQ integration, and ASP.NET Core middleware.",
    features: ["ASP.NET Core", "Entity Framework", "Blazor support", "Async streams"],
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
    name: "React",
    icon: Monitor,
    language: "typescript",
    description:
      "React hooks and context for authentication. Supports Server Components and client-side mounting.",
    features: ["Hooks API", "Context provider", "SSR compatible", "Tiny bundle"],
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
    name: "Vue",
    icon: Globe,
    language: "typescript",
    description: "Vue 3 composition API plugin with Pinia store integration and auto-refresh.",
    features: ["Composition API", "Pinia store", "Auto-refresh", "Router hooks"],
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
    name: "Angular",
    icon: Layers,
    language: "typescript",
    description: "Angular module with HTTP interceptors, guards, and reactive state management.",
    features: ["HTTP interceptors", "Route guards", "RxJS observables", "Lazy loading"],
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
    name: "iOS",
    icon: Smartphone,
    language: "swift",
    description:
      "Native Swift SDK with Combine support, ASWebAuthenticationSession, and Keychain integration.",
    features: ["Combine", "Keychain", "Passkeys", "WidgetKit"],
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
    name: "Android",
    icon: Smartphone,
    language: "kotlin",
    description:
      "Kotlin SDK with Coroutines, Jetpack Compose support, and BiometricPrompt integration.",
    features: ["Coroutines", "Jetpack Compose", "Biometric", "WorkManager"],
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
                Developer SDKs
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Integrate Identity Into Your Stack
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Official SDKs for every major language and platform. Built for developers, with full
                type safety, excellent documentation, and enterprise support.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link href="/docs/quickstarts">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    View Quickstarts
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/docs/api">
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    API Reference
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
              {features.map((feature) => (
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
                Backend SDKs
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Server-Side Integration
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Robust SDKs for your backend services. Handle authentication, authorization, and
                user management with full type safety.
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
                Frontend SDKs
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Browser & SPA Integration
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Lightweight SDKs for web applications. Universal JavaScript support with React, Vue,
                and Angular.
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
                Mobile SDKs
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Native Mobile Integration
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Native SDKs for iOS and Android. Full platform integration with biometrics,
                keychain, and push notifications.
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
                Supported Platforms
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Official SDKs for every major platform. Community-maintained SDKs also available for
                Ruby, PHP, Rust, andElixir.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                "Node.js",
                "Python",
                "Go",
                "Java",
                ".NET",
                "React",
                "Vue",
                "Angular",
                "iOS",
                "Android",
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
              <Link href="/docs/quickstarts">
                <Button variant="outline" className="gap-2">
                  <Code2 className="h-4 w-4" />
                  Browse All Quickstarts
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
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Common questions about our SDKs and integration options.
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
                Ready to Integrate?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose your platform and start integrating in minutes. All SDKs include
                comprehensive guides and enterprise support.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/docs/quickstarts">
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
