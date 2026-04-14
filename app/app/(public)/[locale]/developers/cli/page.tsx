import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/public/CodeBlock";
import {
  Terminal,
  Download,
  Server,
  Shield,
  Database,
  Cloud,
  Plug,
  ArrowRight,
  RefreshCw,
  FileText,
  Users,
} from "lucide-react";

const cliFeatures = [
  {
    icon: Download,
    title: "Quick Installation",
    description:
      "Install the CLI with a single command via npm, Homebrew, or download the binary directly. Get started in seconds.",
  },
  {
    icon: Terminal,
    title: "Intuitive Commands",
    description:
      "Human-readable commands for managing applications, users, and configurations. No YAML expertise required.",
  },
  {
    icon: Plug,
    title: "Plugin System",
    description:
      "Extend functionality with plugins for custom providers, templates, and integrations with your existing tools.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description:
      "Built-in security checks, secret management, and compliance validation before every deployment.",
  },
  {
    icon: Cloud,
    title: "Multi-Environment",
    description:
      "Deploy to development, staging, and production with environment-specific configurations.",
  },
  {
    icon: RefreshCw,
    title: "Automated Updates",
    description:
      "Keep your CLI and templates up to date with automatic update checks and migration helpers.",
  },
];

const installationMethods = [
  {
    method: "npm",
    command: "npm install -g @aether-identity/cli",
    badge: "Recommended",
  },
  {
    method: "Homebrew",
    command: "brew install aether-identity/cli",
    badge: null,
  },
  {
    method: "Docker",
    command: "docker run -it skygenesisenterprise/aether-identity/cli:latest",
    badge: null,
  },
  {
    method: "Binary",
    command: "curl -fsSL https://identity.skygenesisenterprise.com/cli/install.sh | sh",
    badge: null,
  },
];

const commands = [
  {
    name: "identity init",
    description: "Initialize a new Aether project with recommended defaults",
    example: "identity init my-app",
  },
  {
    name: "identity login",
    description: "Authenticate with your Aether domain",
    example: "identity login --domain auth.company.com",
  },
  {
    name: "identity apps create",
    description: "Create a new application",
    example: "identity apps create web --type spa",
  },
  {
    name: "identity users list",
    description: "List all users in your domain",
    example: "identity users list --filter role=admin",
  },
  {
    name: "identity auth test",
    description: "Test authentication flow",
    example: "identity auth test --flow authorization-code",
  },
  {
    name: "identity deploy",
    description: "Deploy configuration to environment",
    example: "identity deploy --env production",
  },
];

const sampleCode = [
  {
    language: "bash",
    filename: "install.sh",
    code: `# Install the CLI
npm install -g @aether-identity/cli

# Verify installation
identity --version
# Output: Aether Identity CLI v2.4.0`,
  },
  {
    language: "bash",
    filename: "quickstart.sh",
    code: `# Initialize a new project
identity init my-identity-app

# Login to your domain
identity login --domain auth.company.com

# Create an application
identity apps create web-app --type spa

# Get your credentials
identity apps credentials web-app`,
  },
];

const integrations = [
  { name: "GitHub Actions", description: "CI/CD automation" },
  { name: "GitLab CI", description: "Pipeline integration" },
  { name: "Jenkins", description: "Build automation" },
  { name: "Terraform", description: "Infrastructure as code" },
  { name: "Ansible", description: "Configuration management" },
  { name: "VS Code", description: "IDE extension" },
];

const useCases = [
  {
    icon: Server,
    title: "Application Management",
    description: "Create, configure, and manage OAuth applications without touching YAML files.",
  },
  {
    icon: Users,
    title: "User Administration",
    description: "Onboard users, assign roles, and manage permissions from the command line.",
  },
  {
    icon: Shield,
    title: "Security Operations",
    description:
      "Rotate secrets, audit access, and enforce security policies across your infrastructure.",
  },
  {
    icon: Database,
    title: "Configuration Management",
    description:
      "Version control your identity configuration and deploy changes across environments.",
  },
];

const faqs = [
  {
    question: "Does the CLI support autocomplete?",
    answer:
      "Yes, the CLI includes built-in shell completion for bash, zsh, and fish. Run `identity completion generate` to set it up.",
  },
  {
    question: "Can I use the CLI with multiple domains?",
    answer:
      "Yes, you can authenticate with multiple domains and switch between them using `identity login --switch` or the `--domain` flag.",
  },
  {
    question: "Is there a dry-run mode?",
    answer:
      "Yes, most commands support `--dry-run` to preview changes before applying them. This helps prevent accidental modifications.",
  },
  {
    question: "How do I upgrade the CLI?",
    answer:
      "Run `identity update` to check for and install the latest version. You can also pin to specific versions with npm.",
  },
];

export default async function CliPage({ params }: { params: Promise<{ locale: string }> }) {
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
                <Terminal className="h-4 w-4" />
                Command Line Interface
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight text-balance">
                Manage Your Identity Infrastructure from the Terminal
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                A powerful, developer-friendly CLI for managing applications, users, and
                configurations. Integrate seamlessly into your development workflow.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <Link href="#installation">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    Install CLI
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#commands">
                  <Button variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                    Explore Commands
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Everything You Need
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Built for developers who prefer the terminal. Fast, intuitive, and powerful.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cliFeatures.map((feature) => (
                <div key={feature.title} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <feature.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-13">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Installation Section */}
        <section id="installation" className="py-20 lg:py-28 border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Install in Seconds
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Choose your preferred package manager or download the binary directly.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {installationMethods.map((method) => (
                <div
                  key={method.method}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">{method.method}</h3>
                    {method.badge && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <code className="block text-sm text-muted-foreground bg-muted/50 rounded p-3 font-mono overflow-x-auto">
                    {method.command}
                  </code>
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
                  From Zero to Deploy
                </h2>
                <p className="mt-4 text-lg text-background/70 leading-relaxed">
                  Initialize a project, authenticate, and deploy your first application in minutes.
                  No configuration files required.
                </p>
                <div className="mt-8">
                  <Link href="/docs/cli">
                    <Button variant="secondary" size="lg" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Full Documentation
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <CodeBlock samples={sampleCode} defaultLanguage="bash" />
              </div>
            </div>
          </div>
        </section>

        {/* Commands Section */}
        <section id="commands" className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Common Commands
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Learn the most frequently used commands to manage your identity infrastructure.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {commands.map((command) => (
                <div
                  key={command.name}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    <code className="text-sm font-mono font-semibold text-foreground">
                      {command.name}
                    </code>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {command.description}
                  </p>
                  <div className="pt-3 border-t border-border/50">
                    <code className="text-xs text-muted-foreground font-mono">
                      {command.example}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Built for Real Workflows
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                The CLI is designed around common development workflows and automation needs.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((useCase) => (
                <div
                  key={useCase.title}
                  className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
                >
                  <useCase.icon className="h-8 w-8 text-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section className="py-20 lg:py-28 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">Integrations</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Seamlessly integrate the CLI into your existing development tools and workflows.
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
              {integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="p-4 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors text-center min-w-48"
                >
                  <Plug className="h-6 w-6 text-foreground mx-auto mb-2" />
                  <div className="text-base font-semibold text-foreground">{integration.name}</div>
                  <div className="text-sm text-muted-foreground">{integration.description}</div>
                </div>
              ))}
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
                Common questions about the Aether CLI.
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="p-6 rounded-lg border border-border bg-card">
                  <h3 className="text-base font-semibold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
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
                Install the CLI and start managing your identity infrastructure from the terminal.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="#installation">
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    Install CLI
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/docs/cli">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    View Documentation
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
