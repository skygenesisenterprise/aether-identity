"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Building2, 
  ChevronDown, 
  Shield, 
  Layers,
  Settings,
  Bell,
  Search
} from "lucide-react"

interface ContextHeaderProps {
  authority: string
  workspace: string
  environment: string
  userRole: string
  isPrivileged?: boolean
}

export function ContextHeader({
  authority,
  workspace,
  environment,
  userRole,
  isPrivileged = false,
}: ContextHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
              <Shield className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">Aether Identity</span>
          </div>
          
          {/* Context Selectors */}
          <div className="flex items-center gap-1 text-sm">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  {authority}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>{authority}</DropdownMenuItem>
                <DropdownMenuItem>Global Authority</DropdownMenuItem>
                <DropdownMenuItem>Regional Authority</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <span className="text-muted-foreground/50">/</span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                  <Layers className="h-3.5 w-3.5" />
                  {workspace}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>{workspace}</DropdownMenuItem>
                <DropdownMenuItem>Development</DropdownMenuItem>
                <DropdownMenuItem>Staging</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Badge variant="outline" className="ml-2 text-xs font-normal border-border text-muted-foreground">
              {environment}
            </Badge>
          </div>
        </div>

        {/* Actions & User */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Settings className="h-4 w-4" />
          </Button>
          
          <div className="ml-2 flex items-center gap-3 border-l border-border pl-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">Admin User</p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">{userRole}</span>
                {isPrivileged && (
                  <Badge className="h-4 px-1 text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/20">
                    Privileged
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-medium text-secondary-foreground">
              AU
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
