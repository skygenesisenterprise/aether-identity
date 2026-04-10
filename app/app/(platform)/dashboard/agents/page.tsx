"use client";

import Link from "next/link";
import { Bot, Shield, FileText, ArrowUpRight, Users, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Users,
    title: "User Auth",
    description:
      "Easily implement secure login experiences for AI agents – from interactive chatbots to background workers.",
    href: "/docs",
  },
  {
    icon: Shield,
    title: "Calling APIs",
    description:
      "Use secure standards to retrieve and store API tokens for Google, Github and more in just a few lines of code.",
    href: "/docs",
  },
  {
    icon: FileText,
    title: "Async Auth",
    description:
      "Let your autonomous, async agents do work in the background with secure authorization flows.",
    href: "/docs",
  },
  {
    icon: ArrowUpRight,
    title: "FGA for RAG",
    description:
      "Only retrieve documents users have access to. Avoid leaking sensitive data in your AI responses.",
    href: "/docs",
  },
];

const quickLinks = [
  {
    title: "Quickstarts",
    description: "Getting started guides to integrate AI Agents in minutes",
    href: "/docs/quickstarts",
  },
  {
    title: "SDKs",
    description: "Libraries for popular frameworks and languages",
    href: "/docs/sdks",
  },
  {
    title: "Sample Apps",
    description: "Bootstrapped example projects to learn from",
    href: "/docs/samples",
  },
];

export default function AgentsPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              NEW
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">AI Agents</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Secure your AI Agents with robust user authentication, secure API access on behalf of
            users, human-in-the-loop controls, and fine-grained authorization for data access.
          </p>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1">Secure your AI Agents</h2>
                <p className="text-muted-foreground">
                  Enable AI Agents to securely access tools, workflows, and data with fine-grained
                  control and just a few lines of code.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Use Cases</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardTitle className="text-base mt-3">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Ready to dive deeper?</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {quickLinks.map((link) => (
              <Link key={link.title} href={link.href} className="group block">
                <Card className="h-full hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      {link.title}
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{link.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <Button variant="outline" asChild>
            <Link href="/docs/agents">
              View Documentation
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/agents/configure">
              Configure Agents
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
