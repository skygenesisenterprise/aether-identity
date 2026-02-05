"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  UserPlus, 
  UserCheck, 
  Users, 
  FileText, 
  Settings,
  ChevronRight
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface QuickAction {
  id: string
  label: string
  description: string
  icon: LucideIcon
  href?: string
}

const actions: QuickAction[] = [
  {
    id: "invite",
    label: "Invite User",
    description: "Send workspace invitation",
    icon: UserPlus,
  },
  {
    id: "review",
    label: "Review Access",
    description: "Audit user permissions",
    icon: UserCheck,
  },
  {
    id: "roles",
    label: "Manage Roles",
    description: "Configure role assignments",
    icon: Users,
  },
  {
    id: "audit",
    label: "View Audit Logs",
    description: "Browse activity history",
    icon: FileText,
  },
  {
    id: "settings",
    label: "Access Settings",
    description: "Configure workspace policies",
    icon: Settings,
  },
]

export function QuickActions() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium text-foreground">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.id}
              variant="ghost"
              className="w-full justify-start gap-3 h-auto py-2.5 px-3 hover:bg-secondary group"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary group-hover:bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
