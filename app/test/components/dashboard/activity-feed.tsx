"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  LogIn, 
  UserCog, 
  Shield, 
  Link2,
  Clock,
  ChevronRight,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface ActivityEvent {
  id: string
  type: "login" | "role_change" | "provisioning" | "integration" | "audit"
  title: string
  description: string
  timestamp: string
  user?: string
  isHighlight?: boolean
}

interface ActivityFeedProps {
  events: ActivityEvent[]
}

const eventIcons: Record<ActivityEvent["type"], LucideIcon> = {
  login: LogIn,
  role_change: UserCog,
  provisioning: Shield,
  integration: Link2,
  audit: AlertCircle,
}

const eventColors: Record<ActivityEvent["type"], string> = {
  login: "text-muted-foreground",
  role_change: "text-amber-400",
  provisioning: "text-accent",
  integration: "text-blue-400",
  audit: "text-destructive",
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-foreground">
            Recent Activity
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground gap-1">
            View all
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {/* Timeline line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
          
          {events.map((event, index) => {
            const Icon = eventIcons[event.type]
            const iconColor = eventColors[event.type]
            
            return (
              <div
                key={event.id}
                className={cn(
                  "relative flex gap-3 py-3",
                  index !== events.length - 1 && "border-b border-border/50"
                )}
              >
                {/* Icon */}
                <div className={cn(
                  "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-card",
                  event.isHighlight ? "border-amber-500/50" : "border-border"
                )}>
                  <Icon className={cn("h-3 w-3", iconColor)} />
                </div>
                
                {/* Content */}
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn(
                      "text-sm font-medium leading-tight",
                      event.isHighlight ? "text-amber-400" : "text-foreground"
                    )}>
                      {event.title}
                    </p>
                    {event.isHighlight && (
                      <Badge className="shrink-0 h-5 px-1.5 text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/20">
                        Review
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{event.timestamp}</span>
                    {event.user && (
                      <>
                        <span className="text-border">•</span>
                        <span>{event.user}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
