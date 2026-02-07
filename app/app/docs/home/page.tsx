import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Terminal,
  Globe,
  Shield,
  Users,
  BookOpen,
  Code2,
  Box,
  Server,
  Lock,
  Rocket,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

const GETTING_STARTED = [
  {
    title: "Introduction",
    href: "/docs/getting-started/introduction",
    desc: "Overview of Aether Identity platform",
  },
  {
    title: "Quick Start",
    href: "/docs/getting-started/quick-start",
    desc: "Get started in 5 minutes",
  },
  {
    title: "Installation",
    href: "/docs/getting-started/installation",
    desc: "Install and set up Aether Identity",
  },
  {
    title: "Configuration",
    href: "/docs/getting-started/configuration",
    desc: "Configure for your environment",
  },
];

const CONCEPTS = [
  {
    title: "Architecture",
    href: "/docs/concepts/architecture",
    icon: Globe,
    desc: "System design and components",
  },
  {
    title: "Identity Model",
    href: "/docs/concepts/identity-model",
    icon: Users,
    desc: "Users, orgs, credentials",
  },
  {
    title: "Authentication",
    href: "/docs/concepts/authentication",
    icon: Shield,
    desc: "OAuth 2.0, OIDC, SAML",
  },
  {
    title: "Authorization",
    href: "/docs/concepts/authorization",
    icon: Lock,
    desc: "RBAC, policies, access control",
  },
];

const SDK = [
  {
    title: "Core SDK",
    href: "/docs/sdk/core",
    icon: Code2,
    desc: "TypeScript SDK for identity",
  },
  {
    title: "Runtime",
    href: "/docs/sdk/runtime",
    icon: Rocket,
    desc: "Deploy identity services",
  },
  {
    title: "Extensions",
    href: "/docs/sdk/extensions",
    icon: Box,
    desc: "Custom providers & plugins",
  },
  {
    title: "CLI & Tools",
    href: "/docs/sdk/tools",
    icon: Terminal,
    desc: "Command-line utilities",
  },
];

const RESOURCES = [
  { title: "API Reference", href: "/docs/reference/api", icon: BookOpen },
  { title: "Integrations", href: "/docs/integrations", icon: Globe },
  { title: "Deployment", href: "/docs/deployment", icon: Server },
  { title: "Security", href: "/docs/security", icon: Shield },
];

export default function DocsHomePage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Aether Identity Documentation
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          A modern, decentralized identity platform for secure authentication
          and authorization. Learn how to integrate Aether Identity into your
          applications.
        </p>
      </div>

      <div className="callout info mb-10">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              New to Aether Identity?
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Start with the{" "}
              <Link href="/docs/getting-started/quick-start">
                Quick Start guide
              </Link>{" "}
              to get up and running in minutes.
            </p>
          </div>
        </div>
      </div>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Getting Started
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {GETTING_STARTED.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm transition-all dark:border-slate-700 dark:bg-slate-800"
            >
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {item.title}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Core Concepts
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {CONCEPTS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-start gap-4 p-5 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm transition-all dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <item.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {item.title}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Code2 className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            SDKs & Tools
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {SDK.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 p-5 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm transition-all dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <item.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-white">
                  {item.title}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {item.desc}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Resources
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {RESOURCES.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm transition-all dark:border-slate-700 dark:bg-slate-800"
            >
              <item.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-medium text-slate-900 dark:text-white">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="https://github.com/aether-identity/aether-identity"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors dark:border-slate-700 dark:bg-slate-800/50"
          >
            <ExternalLink className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                View on GitHub
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Report issues, contribute code
              </p>
            </div>
          </a>
          <Link
            href="/docs/reference/api"
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors dark:border-slate-700 dark:bg-slate-800/50"
          >
            <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                API Reference
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Browse complete API docs
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
