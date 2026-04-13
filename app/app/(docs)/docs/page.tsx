"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Rocket,
  Server,
  AppWindow,
  Package,
  Shield,
  Globe,
  Key,
  Code2,
  Container,
  Cloud,
  BookOpen,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Getting Started",
    description: "Quick start guide to set up Aether Identity",
    icon: Rocket,
    href: "/docs/getting-started",
  },
  {
    title: "Architecture",
    description: "Understand the system architecture and components",
    icon: Globe,
    href: "/docs/architecture",
  },
  {
    title: "Server",
    description: "Go backend with Gin, GORM, and PostgreSQL",
    icon: Server,
    href: "/docs/server/overview",
  },
  {
    title: "Frontend App",
    description: "Next.js 16 + React 19 with shadcn/ui",
    icon: AppWindow,
    href: "/docs/app/overview",
  },
  {
    title: "Packages SDK",
    description: "Node.js, Go, GitHub App, Docker, and more",
    icon: Package,
    href: "/docs/packages",
  },
  {
    title: "API Reference",
    description: "Complete API documentation",
    icon: BookOpen,
    href: "/docs/api-reference",
  },
];

const quickLinks = [
  { title: "Authentication", icon: Key, href: "/docs/app/authentication" },
  { title: "OAuth & SSO", icon: Shield, href: "/docs/guides/oauth" },
  { title: "Docker Deployment", icon: Container, href: "/docs/deployment/docker" },
  { title: "Kubernetes", icon: Cloud, href: "/docs/deployment/kubernetes" },
  { title: "API Endpoints", icon: Code2, href: "/docs/server/api-reference" },
];

export default function DocsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">Aether Identity Documentation</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Complete guide to integrating and using Aether Identity - Modern Identity Server
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/docs/getting-started">
                Get Started <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="https://github.com/skygenesisenterprise/aether-identity" target="_blank">
                View on GitHub
              </Link>
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href={feature.href}>
                      Learn more <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Button
                key={link.title}
                variant="outline"
                className="h-auto py-4 justify-start"
                asChild
              >
                <Link href={link.href}>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.title}
                </Link>
              </Button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>Latest Version: v1.0+</CardTitle>
              <CardDescription>
                Aether Identity has evolved with complete package ecosystem, GitHub Marketplace
                integration, and enterprise-ready capabilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "Complete Authentication System with JWT",
                  "Node.js & Go SDKs",
                  "GitHub App Integration",
                  "Docker & Kubernetes Support",
                  "60+ Make Commands",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
