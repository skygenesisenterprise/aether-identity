"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Layers,
  Shield,
  Clock
} from "lucide-react"

interface ContextOverviewProps {
  authority: string
  workspace: string
  role: string
  accessLevel: string
  isPrivileged?: boolean
  lastLogin: string
}

export function ContextOverview({
  authority,
  workspace,
  role,
  accessLevel,
  isPrivileged = false,
  lastLogin,
}: ContextOverviewProps) {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
          {/* Authority */}
          <div className="p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Building2 className="h-3 w-3" />
              Authority
            </div>
            <p className="text-sm font-medium text-foreground truncate">{authority}</p>
          </div>
          
          {/* Workspace */}
          <div className="p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Layers className="h-3 w-3" />
              Workspace
            </div>
            <p className="text-sm font-medium text-foreground truncate">{workspace}</p>
          </div>
          
          {/* Role & Access */}
          <div className="p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Shield className="h-3 w-3" />
              Role
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">{role}</p>
              {isPrivileged && (
                <Badge className="h-5 px-1.5 text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/20">
                  Privileged
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{accessLevel}</p>
          </div>
          
          {/* Last Login */}
          <div className="p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Clock className="h-3 w-3" />
              Last Active
            </div>
            <p className="text-sm font-medium text-foreground">{lastLogin}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
