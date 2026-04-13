"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  MoreHorizontal,
  Mail,
  Shield,
  Key,
  LogIn,
  Trash2,
  Edit,
  ArrowUpDown,
  Filter,
  Download,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  XCircle,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    status: "active",
    connection: "Username-Password",
    mfa: true,
    lastLogin: "2 minutes ago",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@company.co",
    status: "active",
    connection: "Google OAuth",
    mfa: true,
    lastLogin: "8 minutes ago",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Unknown User",
    email: "unknown@test.com",
    status: "blocked",
    connection: "Username-Password",
    mfa: false,
    lastLogin: "15 minutes ago",
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Admin User",
    email: "admin@etheriatimes.com",
    status: "active",
    connection: "SAML Enterprise",
    mfa: true,
    lastLogin: "22 minutes ago",
    createdAt: "2024-01-01",
  },
  {
    id: "5",
    name: "Secure User",
    email: "secure@company.org",
    status: "active",
    connection: "Username-Password",
    mfa: true,
    lastLogin: "31 minutes ago",
    createdAt: "2024-02-28",
  },
  {
    id: "6",
    name: "Test User",
    email: "test@example.com",
    status: "pending",
    connection: "Username-Password",
    mfa: false,
    lastLogin: "Never",
    createdAt: "2024-03-25",
  },
  {
    id: "7",
    name: "Demo Account",
    email: "demo@demo.com",
    status: "inactive",
    connection: "Username-Password",
    mfa: false,
    lastLogin: "30 days ago",
    createdAt: "2024-01-20",
  },
  {
    id: "8",
    name: "API Service",
    email: "api@service.io",
    status: "active",
    connection: "Client Credentials",
    mfa: false,
    lastLogin: "1 hour ago",
    createdAt: "2024-02-05",
  },
];

function getStatusIcon(status: string) {
  switch (status) {
    case "active":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "blocked":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "pending":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    case "inactive":
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs font-normal">
          Active
        </Badge>
      );
    case "blocked":
      return (
        <Badge variant="destructive" className="text-xs font-normal">
          Blocked
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs font-normal">
          Pending
        </Badge>
      );
    case "inactive":
      return (
        <Badge variant="secondary" className="text-xs font-normal">
          Inactive
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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [connectionFilter, setConnectionFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesConnection = connectionFilter === "all" || user.connection === connectionFilter;
    return matchesSearch && matchesStatus && matchesConnection;
  });

  const activeUsers = mockUsers.filter((u) => u.status === "active").length;
  const blockedUsers = mockUsers.filter((u) => u.status === "blocked").length;
  const pendingUsers = mockUsers.filter((u) => u.status === "pending").length;
  const totalUsers = mockUsers.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Identity Users</h1>
            <p className="text-muted-foreground">
              Manage and monitor users across your identity platform.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="blocked">Blocked</TabsTrigger>
            </TabsList>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </div>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">User Directory</CardTitle>
                    <CardDescription>{filteredUsers.length} users found</CardDescription>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 items-center gap-2">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={connectionFilter} onValueChange={setConnectionFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Connection" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Connections</SelectItem>
                        <SelectItem value="Username-Password">Username-Password</SelectItem>
                        <SelectItem value="Google OAuth">Google OAuth</SelectItem>
                        <SelectItem value="SAML Enterprise">SAML Enterprise</SelectItem>
                        <SelectItem value="Client Credentials">Client Credentials</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      More Filters
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedUsers.length === filteredUsers.length &&
                            filteredUsers.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="w-64">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-ml-4 h-8 data-[state=open]:bg-muted"
                        >
                          User
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-32">Status</TableHead>
                      <TableHead className="w-40">Connection</TableHead>
                      <TableHead className="w-20 text-center">MFA</TableHead>
                      <TableHead className="w-32">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-ml-4 h-8 data-[state=open]:bg-muted"
                        >
                          Last Login
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="py-3">
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={(checked) =>
                              handleSelectUser(user.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="" />
                              <AvatarFallback className="text-xs">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{user.name}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="py-3">
                          <span className="text-sm text-muted-foreground">{user.connection}</span>
                        </TableCell>
                        <TableCell className="py-3 text-center">
                          {user.mfa ? (
                            <Badge variant="outline" className="text-xs font-normal">
                              <Shield className="mr-1 h-3 w-3" />
                              Enabled
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="text-sm text-muted-foreground">{user.lastLogin}</span>
                        </TableCell>
                        <TableCell className="py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Key className="mr-2 h-4 w-4" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <LogIn className="mr-2 h-4 w-4" />
                                Force Logout
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Active Users</CardTitle>
                <CardDescription>{activeUsers} users currently active</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-64">User</TableHead>
                      <TableHead className="w-40">Connection</TableHead>
                      <TableHead className="w-20 text-center">MFA</TableHead>
                      <TableHead className="w-32">Last Login</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers
                      .filter((u) => u.status === "active")
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="" />
                                <AvatarFallback className="text-xs">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{user.name}</span>
                                <span className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <span className="text-sm text-muted-foreground">{user.connection}</span>
                          </TableCell>
                          <TableCell className="py-3 text-center">
                            {user.mfa ? (
                              <Badge variant="outline" className="text-xs font-normal">
                                <Shield className="mr-1 h-3 w-3" />
                                Enabled
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="py-3">
                            <span className="text-sm text-muted-foreground">{user.lastLogin}</span>
                          </TableCell>
                          <TableCell className="py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit User</DropdownMenuItem>
                                <DropdownMenuItem>Send Email</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Pending Users</CardTitle>
                <CardDescription>{pendingUsers} users awaiting verification</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-64">User</TableHead>
                      <TableHead className="w-40">Connection</TableHead>
                      <TableHead className="w-32">Created</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers
                      .filter((u) => u.status === "pending")
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="" />
                                <AvatarFallback className="text-xs">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{user.name}</span>
                                <span className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <span className="text-sm text-muted-foreground">{user.connection}</span>
                          </TableCell>
                          <TableCell className="py-3">
                            <span className="text-sm text-muted-foreground">{user.createdAt}</span>
                          </TableCell>
                          <TableCell className="py-3">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Mail className="mr-2 h-4 w-4" />
                                Resend Invite
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blocked" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Blocked Users</CardTitle>
                <CardDescription>{blockedUsers} blocked users</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-64">User</TableHead>
                      <TableHead className="w-40">Connection</TableHead>
                      <TableHead className="w-32">Last Login</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers
                      .filter((u) => u.status === "blocked")
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="" />
                                <AvatarFallback className="text-xs">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{user.name}</span>
                                <span className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <span className="text-sm text-muted-foreground">{user.connection}</span>
                          </TableCell>
                          <TableCell className="py-3">
                            <span className="text-sm text-muted-foreground">{user.lastLogin}</span>
                          </TableCell>
                          <TableCell className="py-3">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                Unblock
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold tracking-tight">{totalUsers}</p>
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
                  <p className="text-3xl font-bold tracking-tight">{activeUsers}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold tracking-tight">{pendingUsers}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Blocked</p>
                  <p className="text-3xl font-bold tracking-tight">{blockedUsers}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
