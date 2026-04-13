import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Terminal,
  Download,
  Play,
  Layers,
  Clock,
  CheckCircle2,
  Settings,
  Key,
  Users,
  Shield,
  Globe,
  BookOpen,
  Code2,
  FileJson,
  Box,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Download,
    title: "One-Click Import",
    description:
      "Import our collection directly into Postman with a single click. All endpoints and authentication pre-configured.",
  },
  {
    icon: Play,
    title: "Ready-to-Run Examples",
    description:
      "Pre-built request examples for every endpoint. Just add your credentials and start testing.",
  },
  {
    icon: Layers,
    title: "Environment Variables",
    description:
      "Built-in environment support for easy switching between development, staging, and production.",
  },
  {
    icon: Clock,
    title: "Save Time",
    description:
      "No more copying requests or writing scripts from scratch. Everything you need is included.",
  },
];

const collections = [
  {
    name: "OAuth 2.0 Flows",
    description: "Authorization code, PKCE, client credentials, and refresh token flows",
    endpoints: 12,
  },
  {
    name: "User Management",
    description: "Create, read, update, and delete users with role assignments",
    endpoints: 8,
  },
  {
    name: "Client Management",
    description: "Register and manage OAuth clients and applications",
    endpoints: 6,
  },
  {
    name: "Session Control",
    description: "List, revoke, and manage active user sessions",
    endpoints: 5,
  },
  {
    name: "Role & Permissions",
    description: "Create roles, assign permissions, and manage access policies",
    endpoints: 7,
  },
  {
    name: "Audit Logs",
    description: "Query and export audit logs for compliance and security",
    endpoints: 4,
  },
];

const benefits = [
  "No authentication setup required - variables handle it all",
  "Automatic token refresh for long-lived testing sessions",
  "Request scripts for common workflows",
  "Response examples for every endpoint",
  "Variable inheritance across collections",
  "Compatible with Postman CLI and Newman",
];

const languages = [
  "cURL",
  "JavaScript (Fetch)",
  "Python (Requests)",
  "Go",
  "Java",
  ".NET",
  "Ruby",
  "PHP",
];

const includedItems = [
  "50+ pre-configured requests",
  "Environment templates",
  "Collection scripts",
  "Response examples",
  "Request templates",
  "Authentication helpers",
];

export default async function DevelopersPostmanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
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
                Postman Collection
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Test the API in Seconds
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Import our Postman collection and start exploring the Aether Identity API
                immediately. No setup required.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Button size="lg" className="gap-2 h-12 px-6 text-base">
                  <Download className="h-4 w-4" />
                  Import Collection
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Link href="/developers/api">
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    <BookOpen className="h-4 w-4" />
                    API Documentation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Everything You Need to Get Started
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Our Postman collection includes everything you need to test and explore the API
                without writing a single line of code.
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

        {/* Collections Overview */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Organized by Resource
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Requests are organized into logical collections, making it easy to find what you
                need and test specific workflows.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <div
                  key={collection.name}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">{collection.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{collection.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Box className="h-4 w-4" />
                    <span>{collection.endpoints} endpoints</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 lg:py-28 border-b border-border bg-foreground text-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-balance">
                  Built for Developers
                </h2>
                <p className="mt-4 text-lg text-background/70 leading-relaxed">
                  We've thought of everything so you can focus on building. No more struggling with
                  authentication or manually crafting requests.
                </p>
                <div className="mt-8 grid gap-3">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                      <span className="text-sm text-background/80">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4">
                <div className="p-6 rounded-lg bg-background/5 border border-background/10">
                  <Terminal className="h-8 w-8 text-background mb-4" />
                  <h3 className="text-lg font-semibold text-background mb-2">Works with Newman</h3>
                  <p className="text-sm text-background/60">
                    Run collections from the command line for CI/CD integration
                  </p>
                </div>
                <div className="p-6 rounded-lg bg-background/5 border border-background/10">
                  <Code2 className="h-8 w-8 text-background mb-4" />
                  <h3 className="text-lg font-semibold text-background mb-2">Code Generation</h3>
                  <p className="text-sm text-background/60">
                    Generate code snippets in your preferred language
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                What's Included
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Everything you need to test and explore the API, all in one package.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {includedItems.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Languages */}
        <section className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Export to Any Language
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Use Postman's code generation to export requests in your preferred programming
                language.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <span
                  key={lang}
                  className="px-4 py-2 text-sm bg-card border border-border rounded-md text-foreground"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                How to Get Started
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Import the collection and start testing in less than a minute.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-semibold text-foreground">1</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Click Import</h3>
                <p className="text-sm text-muted-foreground">
                  Click the import button and select "Import from URL" or drag the JSON file
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-semibold text-foreground">2</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Configure Environment
                </h3>
                <p className="text-sm text-muted-foreground">
                  Set your domain, client ID, and secret in the environment variables
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-semibold text-foreground">3</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Start Testing</h3>
                <p className="text-sm text-muted-foreground">
                  Send requests and explore the API. Authentication is handled automatically
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Ready to Explore the API?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Import our Postman collection and start testing the Aether Identity API today.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="gap-2 h-12 px-8 text-base">
                  <Download className="h-4 w-4" />
                  Import Collection
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Link href="/developers/api">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    View API Docs
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
