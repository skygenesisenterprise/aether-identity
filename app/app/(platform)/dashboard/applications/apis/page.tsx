"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, MoreHorizontal, ArrowUpRight, Copy, Key, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const apis = [
  {
    id: "api_1",
    name: "My Account API",
    description:
      "Introducing a brand new API enabling you to build a secure account management experience in no time.",
    identifier: "https://identity.skygenesisenterprise.com/api/v1/account",
    scopes: 5,
    isSystem: false,
    isEarlyAccess: false,
  },
  {
    id: "api_2",
    name: "My Organization API",
    description:
      "Introducing a brand new API to enable you to provide your customers self-service organization management capabilities. By using this feature, you agree to the applicable Free Trial terms in Aether's Master Subscription Agreement.",
    identifier: "https://identity.skygenesisenterprise.com/api/v1/organization",
    scopes: 8,
    isSystem: false,
    isEarlyAccess: true,
  },
  {
    id: "api_3",
    name: "Auth0 Management API",
    description: "System API for managing your Aether Identity tenant.",
    identifier: "https://identity.skygenesisenterprise.com/api/v1/",
    scopes: 24,
    isSystem: true,
    isEarlyAccess: false,
  },
];

export default function ApisPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [apiName, setApiName] = useState("");
  const [apiIdentifier, setApiIdentifier] = useState("");
  const [tokenProfile, setTokenProfile] = useState("jwt");
  const [tokenAlgorithm, setTokenAlgorithm] = useState("RS256");
  const [accessPolicy, setAccessPolicy] = useState("allow");
  const [createdApis, setCreatedApis] = useState(apis);

  const handleCreate = () => {
    if (!apiName || !apiIdentifier) return;

    const newApi = {
      id: `api_${Date.now()}`,
      name: apiName,
      description: "",
      identifier: apiIdentifier,
      scopes: 0,
      isSystem: false,
      isEarlyAccess: false,
    };

    setCreatedApis([...createdApis, newApi]);
    setDialogOpen(false);
    setApiName("");
    setApiIdentifier("");
    setTokenProfile("jwt");
    setTokenAlgorithm("RS256");
    setAccessPolicy("allow");
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">APIs</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Define APIs that you can consume from your authorized applications.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {createdApis.length} API{createdApis.length !== 1 ? "s" : ""}
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create API
          </Button>
        </div>

        <div className="space-y-3">
          {createdApis.map((api) => (
            <Card key={api.id} className="hover:border-primary/30 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        api.isSystem ? "bg-amber-500/10" : "bg-primary/10"
                      }`}
                    >
                      {api.isSystem ? (
                        <Zap className="h-5 w-5 text-amber-600" />
                      ) : api.isEarlyAccess ? (
                        <Shield className="h-5 w-5 text-primary" />
                      ) : (
                        <Key className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {api.name}
                        {api.isSystem && (
                          <Badge variant="outline" className="text-xs">
                            System API
                          </Badge>
                        )}
                        {api.isEarlyAccess && (
                          <Badge variant="secondary" className="text-xs">
                            Early Access
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{api.scopes} scopes</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/applications/apis/${api.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      {!api.isSystem && (
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/applications/apis/${api.id}/settings`}>
                            Settings
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {api.description && (
                  <p className="text-sm text-muted-foreground mb-3">{api.description}</p>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">API Audience:</span>
                  <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                    {api.identifier}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(api.identifier);
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="pt-4 border-t">
          <Button variant="outline" asChild>
            <Link href="/docs/apis">
              View Documentation
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Custom API</DialogTitle>
            <DialogDescription className="sr-only">Create a new custom API</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-sm font-medium mb-4">General Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-name">Name</Label>
                  <Input
                    id="api-name"
                    placeholder="My API"
                    value={apiName}
                    onChange={(e) => setApiName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Friendly name for the API. The following characters are not allowed: &lt; &gt;
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-identifier">Identifier</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      https://your-api-endpoint/
                    </span>
                    <Input
                      id="api-identifier"
                      placeholder="api"
                      value={apiIdentifier}
                      onChange={(e) => setApiIdentifier(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Unique identifier for the API. This value will be used as the audience parameter
                    on authorization calls. Identifier cannot be changed later.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-4">JSON Web Token (JWT) settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile</Label>
                  <Select value={tokenProfile} onValueChange={setTokenProfile}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jwt">JWT</SelectItem>
                      <SelectItem value="saml">SAML</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Profile used when issuing access tokens for this API. Learn more about token
                    profiles
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Algorithm</Label>
                  <Select value={tokenAlgorithm} onValueChange={setTokenAlgorithm}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RS256">RS256</SelectItem>
                      <SelectItem value="HS256">HS256</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Algorithm used to sign access tokens issued for this API. Learn more about
                    signing algorithms
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-4">Access Policy for Applications</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <input
                    type="radio"
                    name="accessPolicy"
                    value="allow"
                    checked={accessPolicy === "allow"}
                    onChange={(e) => setAccessPolicy(e.target.value)}
                    className="h-4 w-4"
                  />
                  <div>
                    <p className="text-sm font-medium">Allow</p>
                    <p className="text-xs text-muted-foreground">
                      Any app can request permissions.
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <input
                    type="radio"
                    name="accessPolicy"
                    value="client-grant"
                    checked={accessPolicy === "client-grant"}
                    onChange={(e) => setAccessPolicy(e.target.value)}
                    className="h-4 w-4"
                  />
                  <div>
                    <p className="text-sm font-medium">Allow via client-grant</p>
                    <p className="text-xs text-muted-foreground">
                      Selected apps can select permissions.
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <input
                    type="radio"
                    name="accessPolicy"
                    value="deny"
                    checked={accessPolicy === "deny"}
                    onChange={(e) => setAccessPolicy(e.target.value)}
                    className="h-4 w-4"
                  />
                  <div>
                    <p className="text-sm font-medium">Deny</p>
                    <p className="text-xs text-muted-foreground">No app can request permissions.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!apiName || !apiIdentifier}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
