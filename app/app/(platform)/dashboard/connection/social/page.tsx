"use client";

import { useState } from "react";
import Link from "next/link";
import { Network, Key, Shield, ArrowUpRight, Globe, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const features = [
  {
    icon: Globe,
    title: "Popular Providers",
    description:
      "Configure social connections like Facebook, Twitter, Github and others so that you can let your users login with them.",
    href: "/docs",
  },
  {
    icon: LogIn,
    title: "Google / Gmail",
    description: "Enable users to sign in with their Google account using google-oauth2.",
    href: "/docs",
  },
  {
    icon: Shield,
    title: "Enterprise Identity",
    description: "Integrate with enterprise identity providers for seamless authentication.",
    href: "/docs",
  },
  {
    icon: Network,
    title: "Multi-Provider",
    description:
      "Support multiple social providers simultaneously for flexible authentication options.",
    href: "/docs",
  },
];

const quickLinks = [
  {
    title: "Social Connections",
    description: "Complete guide to social login",
    href: "/docs/social",
  },
  {
    title: "Google OAuth2",
    description: "Configure Google authentication",
    href: "/docs/social/google",
  },
  {
    title: "Provider List",
    description: "All available social providers",
    href: "/docs/social/providers",
  },
];

export default function SocialPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Network className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Social Connections</h1>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <LogIn className="mr-2 h-4 w-4" />
            New Social Connection
          </Button>
        </div>

        <p className="text-lg text-muted-foreground leading-relaxed">
          Configure social connections like Facebook, Twitter, Github and others so that you can let
          your users login with them.
        </p>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1">google-oauth2</h2>
                <p className="text-muted-foreground">
                  Google / Gmail - Enable users to sign in with their Google account.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
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
          <h2 className="text-xl font-semibold mb-4">Resources</h2>
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
            <Link href="/docs/social">
              View Documentation
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/connection/social/configure">
              Configure Social
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Social Connection</DialogTitle>
            <DialogDescription className="sr-only">
              Create a new social connection
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Identity Provider</Label>
              <Input id="provider" placeholder="e.g., google-oauth2, facebook" />
              <p className="text-xs text-muted-foreground">
                Enter the identity provider name for the social connection.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-id">Client ID</Label>
              <Input id="client-id" placeholder="Enter the client ID from the provider" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-secret">Client Secret</Label>
              <Input
                id="client-secret"
                type="password"
                placeholder="Enter the client secret from the provider"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialogOpen(false)}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
