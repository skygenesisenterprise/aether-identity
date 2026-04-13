"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  MoreHorizontal,
  Users,
  ArrowRight,
  Globe,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const organizations = [
  {
    id: "org_1",
    name: "Acme Corporation",
    slug: "acme-corp",
    members: 24,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "org_2",
    name: "TechStart Inc",
    slug: "techstart",
    members: 8,
    status: "active",
    createdAt: "2024-03-22",
  },
  {
    id: "org_3",
    name: "Global Dynamics",
    slug: "global-dynamics",
    members: 156,
    status: "active",
    createdAt: "2023-11-08",
  },
];

export default function OrganizationsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [createdOrgs, setCreatedOrgs] = useState(organizations);

  const handleCreate = () => {
    if (!orgName) return;

    const slug = orgName.toLowerCase().replace(/\s+/g, "-");
    const newOrg = {
      id: `org_${Date.now()}`,
      name: orgName,
      slug,
      members: 1,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setCreatedOrgs([...createdOrgs, newOrg]);
    setDialogOpen(false);
    setOrgName("");
    setOrgDescription("");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Identity Organizations</h1>
            <p className="text-muted-foreground">
              Manage organizations to collaborate with your team and structure your users.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Organizations</p>
                  <p className="text-3xl font-bold tracking-tight">{createdOrgs.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Building2 className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {createdOrgs.reduce((acc, org) => acc + org.members, 0)}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Users className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {createdOrgs.filter((org) => org.status === "active").length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Globe className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Your Organizations</CardTitle>
                <CardDescription>Manage and organize your team members</CardDescription>
              </div>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Organization
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {createdOrgs.map((org) => (
                <div
                  key={org.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Building2 className="h-5 w-5 text-foreground" />
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
                          <Link href={`/dashboard/organizations/${org.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/organizations/${org.id}/settings`}>Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{org.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{org.slug}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{org.members} members</span>
                  </div>
                  <Badge
                    variant={org.status === "active" ? "outline" : "secondary"}
                    className="w-fit text-xs"
                  >
                    {org.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="group cursor-pointer transition-all hover:shadow-md">
            <Link href="https://docs.aetheridentity.dev/organizations" target="_blank">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <ExternalLink className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Organization Documentation</p>
                  <p className="text-sm text-muted-foreground">Learn how to manage organizations</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Link>
          </Card>

          <Card className="group cursor-pointer transition-all hover:shadow-md">
            <Link href="/dashboard/users">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Users className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Manage Users</p>
                  <p className="text-sm text-muted-foreground">
                    View and manage all users across organizations
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create organization</DialogTitle>
            <DialogDescription className="sr-only">Create a new organization</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Name</Label>
              <Input
                id="org-name"
                placeholder="My Organization"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You can change the organization name later in the settings.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-description">Description (optional)</Label>
              <Textarea
                id="org-description"
                placeholder="Enter a description for your organization"
                value={orgDescription}
                onChange={(e) => setOrgDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!orgName}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
