"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Search,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Copy,
  Users,
  Key,
  Settings,
  ChevronRight,
  CheckCircle2,
  ArrowUpDown,
  Loader2,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const mockRoles = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access with all permissions",
    users: 3,
    permissions: 24,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Admin",
    description: "Administrative access to manage users and settings",
    users: 12,
    permissions: 18,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    name: "Developer",
    description: "Access to API keys and application management",
    users: 45,
    permissions: 12,
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "Support Agent",
    description: "Customer support access to user management",
    users: 28,
    permissions: 8,
    status: "active",
    createdAt: "2024-02-15",
  },
  {
    id: "5",
    name: "Viewer",
    description: "Read-only access to dashboard and logs",
    users: 156,
    permissions: 4,
    status: "active",
    createdAt: "2024-03-01",
  },
  {
    id: "6",
    name: "Custom Role",
    description: "Custom role with specific permissions",
    users: 7,
    permissions: 6,
    status: "active",
    createdAt: "2024-03-10",
  },
  {
    id: "7",
    name: "Deprecated Role",
    description: "Old role no longer in use",
    users: 0,
    permissions: 10,
    status: "deprecated",
    createdAt: "2023-12-01",
  },
];

const permissionCategories = [
  {
    name: "Users",
    permissions: ["users:read", "users:create", "users:update", "users:delete", "users:export"],
  },
  {
    name: "Roles",
    permissions: ["roles:read", "roles:create", "roles:update", "roles:delete"],
  },
  {
    name: "Applications",
    permissions: [
      "applications:read",
      "applications:create",
      "applications:update",
      "applications:delete",
    ],
  },
  {
    name: "Authentication",
    permissions: ["auth:read", "auth:manage", "mfa:enable", "mfa:disable"],
  },
  {
    name: "Logs",
    permissions: ["logs:read", "logs:export"],
  },
  {
    name: "Settings",
    permissions: ["settings:read", "settings:update", "billing:manage"],
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs font-normal">
          Active
        </Badge>
      );
    case "deprecated":
      return (
        <Badge variant="secondary" className="text-xs font-normal">
          Deprecated
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-xs font-normal">
          {status}
        </Badge>
      );
  }
}

export default function RolesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState(mockRoles);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRoles(mockRoles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || role.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeRoles = roles.filter((r) => r.status === "active").length;
  const totalUsers = roles.reduce((acc, r) => acc + r.users, 0);
  const totalPermissions = roles.reduce((acc, r) => acc + r.permissions, 0);

  const selectedRoleData = roles.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Identity Users Roles</h1>
            <p className="text-muted-foreground">
              Manage role-based access control and permissions.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Roles</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {loading ? "-" : roles.length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Shield className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Active Roles</p>
                  <p className="text-3xl font-bold tracking-tight">{activeRoles}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold tracking-tight">{totalUsers}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Permissions</p>
                  <p className="text-3xl font-bold tracking-tight">{totalPermissions}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Key className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="roles" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="roles">All Roles</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </div>

          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Role Directory</CardTitle>
                    <CardDescription>{filteredRoles.length} roles found</CardDescription>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 items-center gap-2">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search roles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="deprecated">Deprecated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-56">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-ml-4 h-8 data-[state=open]:bg-muted"
                        >
                          Role
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-64">Description</TableHead>
                      <TableHead className="w-24 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-ml-4 h-8 data-[state=open]:bg-muted"
                        >
                          Users
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-24 text-center">Permissions</TableHead>
                      <TableHead className="w-28">Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-red-500">
                          {error}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {filteredRoles.map((role) => (
                          <TableRow
                            key={role.id}
                            className={cn(
                              "cursor-pointer",
                              selectedRole === role.id && "bg-muted/50"
                            )}
                            onClick={() => setSelectedRole(role.id)}
                          >
                            <TableCell className="py-3">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                  <Shield className="h-5 w-5 text-foreground" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">{role.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    Created {role.createdAt}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-3">
                              <span className="text-sm text-muted-foreground line-clamp-1">
                                {role.description}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{role.users}</span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Key className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{role.permissions}</span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3">{getStatusBadge(role.status)}</TableCell>
                            <TableCell className="py-3">
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
                                  <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Edit Role
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Users className="mr-2 h-4 w-4" />
                                    Manage Users
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Role
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div>
                  <CardTitle className="text-base font-semibold">Permission Categories</CardTitle>
                  <CardDescription>
                    View and manage available permissions across the system
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {permissionCategories.map((category) => (
                    <div
                      key={category.name}
                      className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{category.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {category.permissions.length} permissions
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {category.permissions.map((permission) => (
                          <div
                            key={permission}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-muted-foreground font-mono text-xs">
                              {permission}
                            </span>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedRoleData && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {selectedRoleData.name}
                    </CardTitle>
                    <CardDescription>Role details and configuration</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Role
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(selectedRoleData.status)}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Users Assigned</span>
                  <span className="text-sm font-medium">{selectedRoleData.users}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Permissions</span>
                  <span className="text-sm font-medium">{selectedRoleData.permissions}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm font-medium">{selectedRoleData.createdAt}</span>
                </div>
                <Separator />
                <div>
                  <span className="text-sm text-muted-foreground">Description</span>
                  <p className="text-sm mt-1">{selectedRoleData.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Permissions for {selectedRoleData.name}
                    </CardTitle>
                    <CardDescription>Permissions assigned to this role</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Permissions
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {permissionCategories.slice(0, 3).map((category) => (
                    <div key={category.name}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">{category.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {category.permissions.length}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.permissions.map((permission) => (
                          <Badge
                            key={permission}
                            variant="secondary"
                            className="text-xs font-normal font-mono"
                          >
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full">
                    View all permissions
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
