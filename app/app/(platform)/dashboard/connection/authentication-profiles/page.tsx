"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Key,
  ArrowRight,
  Lock,
  ArrowUpRight,
  ExternalLink,
  Fingerprint,
  Smartphone,
  Mail,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    icon: Fingerprint,
    title: "Biometric Authentication",
    description:
      "Support fingerprint, face recognition, and other biometric methods for secure passwordless login.",
    href: "/docs",
  },
  {
    icon: Smartphone,
    title: "Mobile Authenticator",
    description:
      "Integrate with mobile authenticator apps like Google Authenticator, Authy, or custom solutions.",
    href: "/docs",
  },
  {
    icon: Mail,
    title: "Email Magic Link",
    description:
      "Send magic links via email for passwordless authentication without any app installation.",
    href: "/docs",
  },
  {
    icon: Clock,
    title: "Time-Based OTP",
    description:
      "Implement TOTP (Time-based One-Time Password) for flexible and secure verification.",
    href: "/docs",
  },
];

const quickLinks = [
  {
    title: "Authentication Profiles",
    description: "Complete guide to auth profiles",
    href: "/docs/auth-profiles",
  },
  {
    title: "Passwordless Setup",
    description: "Configure passwordless authentication",
    href: "/docs/passwordless",
  },
  {
    title: "MFA Methods",
    description: "All available MFA methods",
    href: "/docs/mfa",
  },
];

const authMethods = [
  {
    id: "webauthn",
    label: "WebAuthn / Passkeys",
    description: "Use passkeys with biometric or PIN verification",
  },
  {
    id: "totp",
    label: "Authenticator App (TOTP)",
    description: "Time-based one-time password from mobile app",
  },
  {
    id: "magiclink",
    label: "Email Magic Link",
    description: "Passwordless login via email verification",
  },
  {
    id: "sms",
    label: "SMS OTP",
    description: "One-time password sent via SMS",
  },
];

export default function AuthenticationProfilesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [requireMfa, setRequireMfa] = useState(false);

  const handleMethodToggle = (id: string) => {
    setSelectedMethods((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    console.log("Creating authentication profile:", {
      profileName,
      methods: selectedMethods,
      requireMfa,
    });
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">Authentication Profiles</h1>
                <p className="text-muted-foreground">
                  Configure passwordless and MFA authentication methods for your users.
                </p>
              </div>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <Lock className="mr-2 h-4 w-4" />
              New Authentication Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold">Passwordless Authentication</h2>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Recommended
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Enable passwordless authentication methods to improve security and user
                  experience. Replace passwords with stronger, more convenient authentication
                  factors.
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
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
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

        <Separator />

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/docs/auth-profiles" target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Documentation
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/connection/authentication-profiles/configure">
              Configure Profiles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Authentication Profile</DialogTitle>
            <DialogDescription className="sr-only">
              Create a new authentication profile
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Profile name</Label>
              <Input
                id="profile-name"
                placeholder="Enter a name for this profile"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                A profile name is required. Must start and end with an alphanumeric character and
                can only contain alphanumeric characters and &apos;-&apos;. Can&apos;t have more
                than 35 characters.
              </p>
            </div>

            <div className="space-y-3">
              <Label>Choose one or more authentication methods</Label>
              <p className="text-xs text-muted-foreground">
                Toggling on a method will enable it for this authentication profile.
              </p>
              <div className="space-y-3">
                {authMethods.map((method) => (
                  <div key={method.id} className="flex items-start gap-3">
                    <Checkbox
                      id={method.id}
                      checked={selectedMethods.includes(method.id)}
                      onCheckedChange={() => handleMethodToggle(method.id)}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label htmlFor={method.id} className="text-sm font-medium cursor-pointer">
                        {method.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="require-mfa"
                  checked={requireMfa}
                  onCheckedChange={(checked) => setRequireMfa(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="require-mfa" className="text-sm cursor-pointer">
                  Require Multi-Factor Authentication
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    Enforce MFA for all users using this profile. This adds an extra layer of
                    security by requiring a second verification factor.
                  </span>
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!profileName || selectedMethods.length === 0}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
