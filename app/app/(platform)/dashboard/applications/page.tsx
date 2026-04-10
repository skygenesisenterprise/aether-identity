"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AppWindow,
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  Copy,
  Smartphone,
  Globe,
  Cpu,
  Check,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const applications = [
  {
    id: "app_1",
    name: "Default App",
    type: "Generic",
    clientId: "P31f0AMfZNKU086N4CjbEnVPmIANmk5Z",
    status: "active",
    isDefault: true,
  },
  {
    id: "app_2",
    name: "My App",
    type: "Regular Web Application",
    clientId: "EAC2A3r64I15SuyR5Qy6xtNf9HgfAcfK",
    status: "active",
    isDefault: false,
  },
];

const applicationTypes = [
  {
    id: "native",
    name: "Native",
    description: "Mobile, desktop, CLI and smart device apps running natively.",
    example: "e.g.: iOS, Electron, Apple TV apps",
    icon: Smartphone,
  },
  {
    id: "spa",
    name: "Single Page Web Application",
    description: "A JavaScript front-end app that uses an API.",
    example: "e.g.: Angular, React, Vue",
    icon: Globe,
  },
  {
    id: "regular",
    name: "Regular Web Application",
    description: "Traditional web app using redirects.",
    example: "e.g.: Node.js Express, ASP.NET, Java, PHP",
    icon: Globe,
  },
  {
    id: "m2m",
    name: "Machine to Machine Application",
    description: "CLIs, daemons or services running on your backend.",
    example: "e.g.: Shell script",
    icon: Cpu,
  },
];

export default function ApplicationsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [createdApps, setCreatedApps] = useState(applications);

  const handleCreate = () => {
    if (!appName || !selectedType) return;

    const type = applicationTypes.find((t) => t.id === selectedType);
    const newApp = {
      id: `app_${Date.now()}`,
      name: appName,
      type: type?.name || "",
      clientId: `${Math.random().toString(36).substring(2, 10)}${Math.random()
        .toString(36)
        .substring(2, 10)}`.toUpperCase(),
      status: "active",
      isDefault: false,
    };

    setCreatedApps([...createdApps, newApp]);
    setDialogOpen(false);
    setAppName("");
    setAppDescription("");
    setSelectedType(null);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">Applications</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Setup a mobile, web or IoT application to use Aether Identity for authentication.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {createdApps.length} application{createdApps.length !== 1 ? "s" : ""}
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Application
          </Button>
        </div>

        <div className="space-y-3">
          {createdApps.map((app) => (
            <Card key={app.id} className="hover:border-primary/30 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <AppWindow className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {app.name}
                        {app.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{app.type}</p>
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
                        <Link href={`/dashboard/applications/${app.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/applications/${app.id}/settings`}>Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Client ID:</span>
                  <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                    {app.clientId}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(app.clientId);
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
            <Link href="/docs/applications">
              View Documentation
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create application</DialogTitle>
            <DialogDescription className="sr-only">Create a new application</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">Name</Label>
              <Input
                id="app-name"
                placeholder="My App"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You can change the application name later in the application settings.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="app-description">Description (optional)</Label>
              <Textarea
                id="app-description"
                placeholder="Enter a description for your application"
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Choose an application type</Label>
              <div className="grid gap-2">
                {applicationTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${
                      selectedType === type.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        selectedType === type.id ? "bg-primary/10" : "bg-muted"
                      }`}
                    >
                      <type.icon
                        className={`h-4 w-4 ${
                          selectedType === type.id ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{type.name}</p>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{type.example}</p>
                    </div>
                    {selectedType === type.id && (
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!appName || !selectedType}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
