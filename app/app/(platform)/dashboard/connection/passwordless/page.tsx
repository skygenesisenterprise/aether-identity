"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Key,
  Shield,
  ArrowRight,
  Smartphone,
  Mail,
  LogIn,
  ArrowUpRight,
  ExternalLink,
  Fingerprint,
  QrCode,
  MessageSquare,
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
    title: "Passkeys",
    description:
      "Enable passwordless authentication with passkeys for a more secure and convenient user experience.",
    href: "/docs",
  },
  {
    icon: QrCode,
    title: "WebAuthn",
    description: "Use WebAuthn standards for seamless authentication across devices and browsers.",
    href: "/docs",
  },
  {
    icon: Smartphone,
    title: "Magic Links",
    description: "Send secure magic links via email or SMS for passwordless login.",
    href: "/docs",
  },
  {
    icon: Mail,
    title: "EmailOTP",
    description: "Authenticate users with one-time passwords sent to their email address.",
    href: "/docs",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Authentication",
    description: "Send one-time passwords via WhatsApp for secure and reliable authentication.",
    href: "/docs",
  },
  {
    icon: Shield,
    title: "Enhanced Security",
    description:
      "Passwordless methods are more secure than traditional passwords against phishing and breaches.",
    href: "/docs",
  },
];

const quickLinks = [
  {
    title: "Passwordless Connections",
    description: "Complete guide to passwordless authentication",
    href: "/docs/passwordless",
  },
  {
    title: "Passkeys Setup",
    description: "Configure passkeys for your users",
    href: "/docs/passwordless/passkeys",
  },
  {
    title: "Magic Links",
    description: "Set up magic link authentication",
    href: "/docs/passwordless/magic-links",
  },
];

const passwordlessTypes = [
  {
    id: "email",
    label: "Email",
    description: "Send magic links or one-time passwords via email",
  },
  {
    id: "sms",
    label: "SMS",
    description: "Send one-time passwords via SMS message",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Send one-time passwords via WhatsApp",
  },
  {
    id: "passkey",
    label: "Passkey",
    description: "Enable WebAuthn/FIDO2 passkey authentication",
  },
];

export default function PasswordlessPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectionName, setConnectionName] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["email"]);
  const [disableSignUps, setDisableSignUps] = useState(false);
  const [brandingEnabled, setBrandingEnabled] = useState(true);

  const handleTypeToggle = (id: string) => {
    setSelectedTypes((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleCreate = () => {
    console.log("Creating passwordless connection:", {
      connectionName,
      types: selectedTypes,
      disableSignUps,
      brandingEnabled,
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
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">Passwordless Connections</h1>
                <p className="text-muted-foreground">
                  Enable passwordless authentication for your users.
                </p>
              </div>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <LogIn className="mr-2 h-4 w-4" />
              New Passwordless Connection
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Fingerprint className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold">Passkey Authentication</h2>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Recommended
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Passkeys are the most secure authentication method. They are resistant to phishing
                  and provide a seamless user experience across devices.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <Link href="/docs/passwordless" target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Documentation
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/connection/passwordless/configure">
              Configure Passwordless
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Passwordless Connection</DialogTitle>
            <DialogDescription className="sr-only">
              Create a new passwordless connection
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="connection-name">Connection name</Label>
              <Input
                id="connection-name"
                placeholder="Enter a name for this passwordless connection"
                value={connectionName}
                onChange={(e) => setConnectionName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                A connection name is required. Please enter a name for the connection.
              </p>
              <p className="text-xs text-muted-foreground">
                Must start and end with an alphanumeric character and can only contain alphanumeric
                characters and &apos;-&apos;. Can&apos;t have more than 35 characters.
              </p>
            </div>

            <div className="space-y-3">
              <Label>Choose passwordless authentication types</Label>
              <p className="text-xs text-muted-foreground">
                Select one or more passwordless authentication methods.
              </p>
              <div className="space-y-3">
                {passwordlessTypes.map((type) => (
                  <div key={type.id} className="flex items-start gap-3">
                    <Checkbox
                      id={type.id}
                      checked={selectedTypes.includes(type.id)}
                      onCheckedChange={() => handleTypeToggle(type.id)}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label htmlFor={type.id} className="text-sm font-medium cursor-pointer">
                        {type.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="disable-signups"
                  checked={disableSignUps}
                  onCheckedChange={(checked) => setDisableSignUps(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="disable-signups" className="text-sm cursor-pointer">
                  Disable Sign Ups
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    Prevent new user signups to your application from public (unauthenticated)
                    endpoints. You will still be able to create users with your API credentials or
                    from the Management dashboard.
                  </span>
                </Label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="branding"
                  checked={brandingEnabled}
                  onCheckedChange={(checked) => setBrandingEnabled(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="branding" className="text-sm cursor-pointer">
                  Enable Custom Branding
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    Apply your custom branding to passwordless authentication screens. This includes
                    email templates and login pages.
                  </span>
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!connectionName}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
