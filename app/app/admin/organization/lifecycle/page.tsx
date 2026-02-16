"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
  RefreshCw,
  Settings,
  Plus,
  Clock,
  CheckCircle2,
  PauseCircle,
  LogOut,
  Archive,
  ArrowRight,
  Users,
  Zap,
  Shield,
  MoreHorizontal,
  Filter,
  Calendar,
  Bell,
  Workflow,
  Layers,
  Edit,
  Trash2,
  Eye,
  Power,
  PowerOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/dashboard/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dashboard/ui/dropdown-menu";
import { Label } from "@/components/dashboard/ui/label";
import { Textarea } from "@/components/dashboard/ui/textarea";
import { Switch } from "@/components/dashboard/ui/switch";
import { Slider } from "@/components/dashboard/ui/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/dashboard/ui/tabs";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type IdentityStatus =
  | "pending"
  | "active"
  | "suspended"
  | "offboarded"
  | "archived";

interface LifecycleState {
  id: IdentityStatus;
  name: string;
  description: string;
  count: number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
}

interface LifecycleTransition {
  id: string;
  from: IdentityStatus;
  to: IdentityStatus;
  trigger: "manual" | "automatic" | "external";
  description: string;
  enabled: boolean;
}

interface AutomationPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: "inactivity" | "offboarding" | "risk" | "hr";
}

// ============================================================================
// MOCK DATA
// ============================================================================

const lifecycleStates: LifecycleState[] = [
  {
    id: "pending",
    name: "Pending",
    description: "Identity awaiting activation or verification",
    count: 23,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: Clock,
  },
  {
    id: "active",
    name: "Active",
    description: "Fully operational with full access rights",
    count: 2134,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: CheckCircle2,
  },
  {
    id: "suspended",
    name: "Suspended",
    description: "Temporarily disabled due to security or policy",
    count: 12,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: PauseCircle,
  },
  {
    id: "offboarded",
    name: "Offboarded",
    description: "Former employee or terminated access",
    count: 156,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    icon: LogOut,
  },
  {
    id: "archived",
    name: "Archived",
    description: "Long-term storage for compliance/audit",
    count: 89,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: Archive,
  },
];

const lifecycleTransitions: LifecycleTransition[] = [
  {
    id: "trans-001",
    from: "pending",
    to: "active",
    trigger: "manual",
    description: "Administrator approves and activates the identity",
    enabled: true,
  },
  {
    id: "trans-002",
    from: "pending",
    to: "active",
    trigger: "external",
    description: "HR system confirms employment start date reached",
    enabled: true,
  },
  {
    id: "trans-003",
    from: "active",
    to: "suspended",
    trigger: "automatic",
    description: "Suspension triggered by risk score threshold exceeded",
    enabled: true,
  },
  {
    id: "trans-004",
    from: "active",
    to: "suspended",
    trigger: "manual",
    description: "Administrator manually suspends the identity",
    enabled: true,
  },
  {
    id: "trans-005",
    from: "suspended",
    to: "active",
    trigger: "manual",
    description: "Administrator reactivates after investigation",
    enabled: true,
  },
  {
    id: "trans-006",
    from: "active",
    to: "offboarded",
    trigger: "external",
    description: "HR system reports employment termination",
    enabled: true,
  },
  {
    id: "trans-007",
    from: "offboarded",
    to: "archived",
    trigger: "automatic",
    description: "Auto-archive after 90 days of offboarding",
    enabled: false,
  },
  {
    id: "trans-008",
    from: "active",
    to: "suspended",
    trigger: "automatic",
    description: "Inactivity detected for 90+ days",
    enabled: true,
  },
];

const automationPolicies: AutomationPolicy[] = [
  {
    id: "auto-001",
    name: "Auto-suspend after inactivity",
    description: "Automatically suspend identities inactive for 90+ days",
    enabled: true,
    category: "inactivity",
  },
  {
    id: "auto-002",
    name: "Auto-archive after offboarding",
    description: "Move offboarded identities to archive after retention period",
    enabled: false,
    category: "offboarding",
  },
  {
    id: "auto-003",
    name: "Risk-based auto-suspension",
    description: "Suspend identities when risk score exceeds threshold",
    enabled: true,
    category: "risk",
  },
  {
    id: "auto-004",
    name: "HR trigger integration",
    description: "Sync lifecycle states with HR system events",
    enabled: true,
    category: "hr",
  },
];

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

function SectionHeader({
  title,
  description,
  icon: Icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: React.ElementType;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
  };
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {action.icon && <action.icon className="h-3.5 w-3.5" />}
          {action.label}
        </button>
      )}
    </div>
  );
}

function TriggerBadge({
  trigger,
}: {
  trigger: LifecycleTransition["trigger"];
}) {
  const config = {
    manual: {
      icon: Users,
      label: "Manual",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    automatic: {
      icon: Zap,
      label: "Automatic",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    external: {
      icon: Workflow,
      label: "External",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
  };

  const { icon: Icon, label, color } = config[trigger];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border",
        color,
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function StateBadge({ stateId }: { stateId: IdentityStatus }) {
  const state = lifecycleStates.find((s) => s.id === stateId);
  if (!state) return null;

  const Icon = state.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        state.bgColor,
        state.color,
        state.borderColor,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {state.name}
    </span>
  );
}

function AutomationCategoryIcon({
  category,
}: {
  category: AutomationPolicy["category"];
}) {
  const icons = {
    inactivity: Clock,
    offboarding: LogOut,
    risk: Shield,
    hr: Users,
  };
  const Icon = icons[category];
  return <Icon className="h-4 w-4" />;
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function LifecycleStatesSection() {
  const totalIdentities = lifecycleStates.reduce((sum, s) => sum + s.count, 0);

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Lifecycle States Overview"
        description="Current distribution of identities across lifecycle states"
        icon={Layers}
      />

      {/* State Flow Visualization */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {lifecycleStates.map((state) => {
            const Icon = state.icon;
            const percentage = Math.round(
              (state.count / totalIdentities) * 100,
            );

            return (
              <Card
                key={state.id}
                className={cn(
                  "border-2 transition-all duration-200 hover:shadow-md",
                  state.borderColor,
                )}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div
                      className={cn(
                        "h-12 w-12 rounded-full flex items-center justify-center",
                        state.bgColor,
                      )}
                    >
                      <Icon className={cn("h-6 w-6", state.color)} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{state.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {state.description}
                      </p>
                    </div>
                    <div className="pt-2 border-t w-full">
                      <p className={cn("text-2xl font-bold", state.color)}>
                        {state.count.toLocaleString("en-US")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {percentage}% of total
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Flow Arrows - Desktop only */}
        <div className="hidden md:flex absolute top-1/2 left-0 right-0 -translate-y-1/2 justify-around px-16 pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <ArrowRight key={i} className="h-5 w-5 text-muted-foreground/30" />
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 rounded-lg bg-muted/50 border">
          <p className="text-xs text-muted-foreground">Total Identities</p>
          <p className="text-xl font-bold">
            {totalIdentities.toLocaleString("en-US")}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <p className="text-xs text-emerald-600">Active Rate</p>
          <p className="text-xl font-bold text-emerald-700">
            {Math.round(
              ((lifecycleStates.find((s) => s.id === "active")?.count || 0) /
                totalIdentities) *
                100,
            )}
            %
          </p>
        </div>
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-xs text-amber-600">Pending Activation</p>
          <p className="text-xl font-bold text-amber-700">
            {lifecycleStates.find((s) => s.id === "pending")?.count || 0}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-xs text-red-600">Suspended</p>
          <p className="text-xl font-bold text-red-700">
            {lifecycleStates.find((s) => s.id === "suspended")?.count || 0}
          </p>
        </div>
      </div>
    </section>
  );
}

function TransitionRulesSection() {
  const [filter, setFilter] = useState<"all" | LifecycleTransition["trigger"]>(
    "all",
  );
  const [transitions, setTransitions] =
    useState<LifecycleTransition[]>(lifecycleTransitions);

  const filteredTransitions = useMemo(() => {
    if (filter === "all") return transitions;
    return transitions.filter((t) => t.trigger === filter);
  }, [filter, transitions]);

  const handleToggleEnabled = (transitionId: string) => {
    setTransitions((prev) =>
      prev.map((t) =>
        t.id === transitionId ? { ...t, enabled: !t.enabled } : t,
      ),
    );
  };

  const handleDelete = (transitionId: string) => {
    setTransitions((prev) => prev.filter((t) => t.id !== transitionId));
  };

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Transition Rules"
        description="Configured state transitions and their triggers"
        icon={RefreshCw}
        action={{
          label: "Manage Rules",
          onClick: () => {},
          icon: Settings,
        }}
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground mr-2">
          Filter by trigger:
        </span>
        {(["all", "manual", "automatic", "external"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border capitalize",
              filter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card hover:bg-muted/50 border-border text-muted-foreground",
            )}
          >
            {f}
            {f !== "all" && (
              <span
                className={cn(
                  "ml-1 px-1.5 py-0.5 rounded-full text-[10px]",
                  filter === f ? "bg-primary-foreground/20" : "bg-muted",
                )}
              >
                {lifecycleTransitions.filter((t) => t.trigger === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Transitions Table */}
      <Card className="border-border">
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredTransitions.map((transition) => (
              <div
                key={transition.id}
                className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1">
                  <StateBadge stateId={transition.from} />
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <StateBadge stateId={transition.to} />
                </div>

                <div className="flex-1">
                  <TriggerBadge trigger={transition.trigger} />
                </div>

                <div className="flex-2 text-sm text-muted-foreground">
                  {transition.description}
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={transition.enabled ? "default" : "secondary"}
                    className={cn(
                      transition.enabled
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-100",
                    )}
                  >
                    {transition.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 hover:bg-muted rounded-md transition-colors">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="cursor-pointer">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Rule
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleToggleEnabled(transition.id)}
                    >
                      {transition.enabled ? (
                        <>
                          <PowerOff className="h-4 w-4 mr-2" />
                          Disable Rule
                        </>
                      ) : (
                        <>
                          <Power className="h-4 w-4 mr-2" />
                          Enable Rule
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={() => handleDelete(transition.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Rule
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>

          {filteredTransitions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Filter className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No transitions found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your filter
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function AutomationPolicySection() {
  return (
    <section className="space-y-4">
      <SectionHeader
        title="Automation & Policy"
        description="Automated lifecycle management policies"
        icon={Zap}
        action={{
          label: "Configure",
          onClick: () => {},
          icon: Settings,
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automationPolicies.map((policy) => (
          <Card
            key={policy.id}
            className={cn(
              "border-2 transition-all duration-200",
              policy.enabled
                ? "border-border hover:border-primary/50"
                : "border-dashed border-border/50 opacity-75",
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      policy.enabled ? "bg-primary/10" : "bg-muted",
                    )}
                  >
                    <AutomationCategoryIcon category={policy.category} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{policy.name}</h3>
                      {!policy.enabled && (
                        <Badge variant="outline" className="text-[10px]">
                          Disabled
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {policy.description}
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    policy.enabled ? "bg-emerald-500" : "bg-slate-300",
                  )}
                  title={policy.enabled ? "Active" : "Inactive"}
                />
              </div>

              {/* Placeholder Configuration */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Configuration:</span>
                  <span className="font-medium text-amber-600">
                    Pending setup
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Event Engine Placeholder */}
      <Card className="border-dashed border-2 border-border/50 bg-muted/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">
                Event Engine Integration
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Future integration with event-driven lifecycle management.
                Subscribe to HR events, security alerts, and compliance triggers
                for automatic state transitions.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Coming soon</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Workflow className="h-3.5 w-3.5" />
                  <span>Webhook support</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

// ============================================================================
// CREATE LIFECYCLE RULE DIALOG COMPONENT
// ============================================================================

interface CreateLifecycleRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

function CreateLifecycleRuleDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateLifecycleRuleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    from: "" as IdentityStatus | "",
    to: "" as IdentityStatus | "",
    trigger: "" as LifecycleTransition["trigger"] | "",
    description: "",
    enabled: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.from) newErrors.from = "Source state is required";
    if (!formData.to) newErrors.to = "Target state is required";
    if (formData.from && formData.to && formData.from === formData.to) {
      newErrors.to = "Source and target states must be different";
    }
    if (!formData.trigger) newErrors.trigger = "Trigger type is required";
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real implementation, you would call your API here
    console.log("Creating lifecycle rule:", {
      ...formData,
      id: `trans-${Date.now()}`,
    });

    setIsSubmitting(false);
    onSuccess?.();
    onOpenChange(false);

    // Reset form
    setFormData({
      from: "",
      to: "",
      trigger: "",
      description: "",
      enabled: true,
    });
    setErrors({});
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      // Reset form after a short delay to allow animation to complete
      setTimeout(() => {
        setFormData({
          from: "",
          to: "",
          trigger: "",
          description: "",
          enabled: true,
        });
        setErrors({});
      }, 300);
    }
  };

  const availableTargets = lifecycleStates.filter(
    (s) => s.id !== formData.from,
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-137.5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Lifecycle Rule
          </DialogTitle>
          <DialogDescription>
            Define a new state transition rule for identity lifecycle
            management.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          {/* Transition States */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-state">
                From State <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.from}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    from: value as IdentityStatus,
                    to: prev.to === value ? "" : prev.to,
                  }))
                }
              >
                <SelectTrigger
                  id="from-state"
                  className={errors.from ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select source state" />
                </SelectTrigger>
                <SelectContent>
                  {lifecycleStates.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      <div className="flex items-center gap-2">
                        <state.icon className={cn("h-4 w-4", state.color)} />
                        {state.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.from && (
                <p className="text-xs text-destructive">{errors.from}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-state">
                To State <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.to}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    to: value as IdentityStatus,
                  }))
                }
                disabled={!formData.from}
              >
                <SelectTrigger
                  id="to-state"
                  className={errors.to ? "border-destructive" : ""}
                >
                  <SelectValue
                    placeholder={
                      formData.from
                        ? "Select target state"
                        : "Select source first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableTargets.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      <div className="flex items-center gap-2">
                        <state.icon className={cn("h-4 w-4", state.color)} />
                        {state.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.to && (
                <p className="text-xs text-destructive">{errors.to}</p>
              )}
            </div>
          </div>

          {/* Trigger Type */}
          <div className="space-y-2">
            <Label htmlFor="trigger-type">
              Trigger Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.trigger}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  trigger: value as LifecycleTransition["trigger"],
                }))
              }
            >
              <SelectTrigger
                id="trigger-type"
                className={errors.trigger ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select trigger type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium">Manual</p>
                      <p className="text-xs text-muted-foreground">
                        Triggered by administrator action
                      </p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="automatic">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="font-medium">Automatic</p>
                      <p className="text-xs text-muted-foreground">
                        Triggered by system conditions
                      </p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="external">
                  <div className="flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-amber-600" />
                    <div>
                      <p className="font-medium">External</p>
                      <p className="text-xs text-muted-foreground">
                        Triggered by external system (HR, etc.)
                      </p>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.trigger && (
              <p className="text-xs text-destructive">{errors.trigger}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe when and why this transition occurs..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className={cn(
                "min-h-20 resize-none",
                errors.description ? "border-destructive" : "",
              )}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Enabled Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
            <div className="space-y-0.5">
              <Label htmlFor="enabled" className="text-sm font-medium">
                Enable Rule
              </Label>
              <p className="text-xs text-muted-foreground">
                Activate this transition rule immediately
              </p>
            </div>
            <Switch
              id="enabled"
              checked={formData.enabled}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, enabled: checked }))
              }
            />
          </div>

          {/* Preview */}
          {formData.from && formData.to && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs font-medium text-primary mb-2">
                Transition Preview
              </p>
              <div className="flex items-center gap-2">
                <StateBadge stateId={formData.from as IdentityStatus} />
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <StateBadge stateId={formData.to as IdentityStatus} />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !formData.from ||
              !formData.to ||
              !formData.trigger
            }
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Rule
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// CONFIGURE LIFECYCLE POLICIES DIALOG COMPONENT
// ============================================================================

interface ConfigureLifecyclePoliciesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

function ConfigureLifecyclePoliciesDialog({
  open,
  onOpenChange,
  onSuccess,
}: ConfigureLifecyclePoliciesDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("inactivity");

  // Inactivity Policy State
  const [inactivityConfig, setInactivityConfig] = useState({
    enabled: true,
    daysThreshold: 90,
    action: "suspend" as "suspend" | "notify" | "archive",
    notifyBefore: 7,
  });

  // Offboarding Policy State
  const [offboardingConfig, setOffboardingConfig] = useState({
    enabled: false,
    autoArchiveAfterDays: 90,
    immediateRevoke: true,
    preserveData: true,
  });

  // Risk Policy State
  const [riskConfig, setRiskConfig] = useState({
    enabled: true,
    riskThreshold: 75,
    autoSuspend: true,
    requireMfa: true,
  });

  // HR Integration State
  const [hrConfig, setHrConfig] = useState({
    enabled: true,
    syncFrequency: "realtime" as "realtime" | "hourly" | "daily",
    autoOffboard: true,
    autoOnboard: false,
  });

  const handleSave = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Saving lifecycle policies:", {
      inactivity: inactivityConfig,
      offboarding: offboardingConfig,
      risk: riskConfig,
      hr: hrConfig,
    });

    setIsSubmitting(false);
    onSuccess?.();
    onOpenChange(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configure Lifecycle Policies
          </DialogTitle>
          <DialogDescription>
            Manage automated policies for identity lifecycle management across
            your organization.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inactivity" className="text-xs">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Inactivity
            </TabsTrigger>
            <TabsTrigger value="offboarding" className="text-xs">
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              Offboarding
            </TabsTrigger>
            <TabsTrigger value="risk" className="text-xs">
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              Risk
            </TabsTrigger>
            <TabsTrigger value="hr" className="text-xs">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              HR Sync
            </TabsTrigger>
          </TabsList>

          {/* Inactivity Policy */}
          <TabsContent value="inactivity" className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  Enable Inactivity Policy
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically manage identities based on login activity
                </p>
              </div>
              <Switch
                checked={inactivityConfig.enabled}
                onCheckedChange={(checked) =>
                  setInactivityConfig((prev) => ({ ...prev, enabled: checked }))
                }
              />
            </div>

            {inactivityConfig.enabled && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Inactivity Threshold</Label>
                    <span className="text-sm font-medium">
                      {inactivityConfig.daysThreshold} days
                    </span>
                  </div>
                  <Slider
                    value={[inactivityConfig.daysThreshold]}
                    onValueChange={(value) =>
                      setInactivityConfig((prev) => ({
                        ...prev,
                        daysThreshold: value[0],
                      }))
                    }
                    min={30}
                    max={365}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Identities inactive for longer than this period will trigger
                    the selected action
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Action on Inactivity</Label>
                  <Select
                    value={inactivityConfig.action}
                    onValueChange={(value) =>
                      setInactivityConfig((prev) => ({
                        ...prev,
                        action: value as typeof prev.action,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notify">
                        Send notification only
                      </SelectItem>
                      <SelectItem value="suspend">Suspend identity</SelectItem>
                      <SelectItem value="archive">Archive identity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Pre-notification Days</Label>
                    <span className="text-sm font-medium">
                      {inactivityConfig.notifyBefore} days before
                    </span>
                  </div>
                  <Slider
                    value={[inactivityConfig.notifyBefore]}
                    onValueChange={(value) =>
                      setInactivityConfig((prev) => ({
                        ...prev,
                        notifyBefore: value[0],
                      }))
                    }
                    min={1}
                    max={30}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Notify users this many days before action is taken
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Offboarding Policy */}
          <TabsContent value="offboarding" className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  Enable Auto-Archive
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically archive identities after offboarding
                </p>
              </div>
              <Switch
                checked={offboardingConfig.enabled}
                onCheckedChange={(checked) =>
                  setOffboardingConfig((prev) => ({
                    ...prev,
                    enabled: checked,
                  }))
                }
              />
            </div>

            {offboardingConfig.enabled && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Archive After</Label>
                    <span className="text-sm font-medium">
                      {offboardingConfig.autoArchiveAfterDays} days
                    </span>
                  </div>
                  <Slider
                    value={[offboardingConfig.autoArchiveAfterDays]}
                    onValueChange={(value) =>
                      setOffboardingConfig((prev) => ({
                        ...prev,
                        autoArchiveAfterDays: value[0],
                      }))
                    }
                    min={30}
                    max={365}
                    step={1}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">
                      Immediate Access Revocation
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Revoke all access immediately upon offboarding
                    </p>
                  </div>
                  <Switch
                    checked={offboardingConfig.immediateRevoke}
                    onCheckedChange={(checked) =>
                      setOffboardingConfig((prev) => ({
                        ...prev,
                        immediateRevoke: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">
                      Preserve Data for Compliance
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Retain identity data for audit and compliance purposes
                    </p>
                  </div>
                  <Switch
                    checked={offboardingConfig.preserveData}
                    onCheckedChange={(checked) =>
                      setOffboardingConfig((prev) => ({
                        ...prev,
                        preserveData: checked,
                      }))
                    }
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {/* Risk Policy */}
          <TabsContent value="risk" className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  Enable Risk-Based Actions
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically respond to high-risk identity behavior
                </p>
              </div>
              <Switch
                checked={riskConfig.enabled}
                onCheckedChange={(checked) =>
                  setRiskConfig((prev) => ({ ...prev, enabled: checked }))
                }
              />
            </div>

            {riskConfig.enabled && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Risk Score Threshold</Label>
                    <span className="text-sm font-medium">
                      {riskConfig.riskThreshold}/100
                    </span>
                  </div>
                  <Slider
                    value={[riskConfig.riskThreshold]}
                    onValueChange={(value) =>
                      setRiskConfig((prev) => ({
                        ...prev,
                        riskThreshold: value[0],
                      }))
                    }
                    min={0}
                    max={100}
                    step={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    Actions trigger when identity risk score exceeds this value
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">
                      Auto-Suspend High Risk
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically suspend identities exceeding risk threshold
                    </p>
                  </div>
                  <Switch
                    checked={riskConfig.autoSuspend}
                    onCheckedChange={(checked) =>
                      setRiskConfig((prev) => ({
                        ...prev,
                        autoSuspend: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">
                      Require MFA Re-verification
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Force MFA re-verification for flagged identities
                    </p>
                  </div>
                  <Switch
                    checked={riskConfig.requireMfa}
                    onCheckedChange={(checked) =>
                      setRiskConfig((prev) => ({
                        ...prev,
                        requireMfa: checked,
                      }))
                    }
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {/* HR Integration */}
          <TabsContent value="hr" className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  Enable HR Integration
                </Label>
                <p className="text-xs text-muted-foreground">
                  Sync identity lifecycle with HR system events
                </p>
              </div>
              <Switch
                checked={hrConfig.enabled}
                onCheckedChange={(checked) =>
                  setHrConfig((prev) => ({ ...prev, enabled: checked }))
                }
              />
            </div>

            {hrConfig.enabled && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Sync Frequency</Label>
                  <Select
                    value={hrConfig.syncFrequency}
                    onValueChange={(value) =>
                      setHrConfig((prev) => ({
                        ...prev,
                        syncFrequency: value as typeof prev.syncFrequency,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">
                        Real-time (Webhooks)
                      </SelectItem>
                      <SelectItem value="hourly">Every hour</SelectItem>
                      <SelectItem value="daily">Once daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">
                      Auto-Offboard on Termination
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically offboard when HR reports termination
                    </p>
                  </div>
                  <Switch
                    checked={hrConfig.autoOffboard}
                    onCheckedChange={(checked) =>
                      setHrConfig((prev) => ({
                        ...prev,
                        autoOffboard: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">
                      Auto-Onboard New Hires
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Create pending identities for new HR records
                    </p>
                  </div>
                  <Switch
                    checked={hrConfig.autoOnboard}
                    onCheckedChange={(checked) =>
                      setHrConfig((prev) => ({
                        ...prev,
                        autoOnboard: checked,
                      }))
                    }
                  />
                </div>

                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-2">
                    <Bell className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        Integration Required
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        HR system integration must be configured in Settings →
                        Integrations before these features can be enabled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Save Policies
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function LifecyclePage() {
  const [isConfigureDialogOpen, setIsConfigureDialogOpen] = useState(false);
  const [isCreateRuleDialogOpen, setIsCreateRuleDialogOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* ==========================================================================
          HEADER SECTION
          ========================================================================== */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Identity Organization Lifecycle
              </h1>
              <Badge variant="secondary" className="text-xs">
                Orchestration
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Control identity states, transitions and automation across the
              organization.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={() => setIsConfigureDialogOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure Policies
            </Button>
            <ConfigureLifecyclePoliciesDialog
              open={isConfigureDialogOpen}
              onOpenChange={setIsConfigureDialogOpen}
              onSuccess={() => {
                console.log("Lifecycle policies saved successfully");
              }}
            />

            <Button onClick={() => setIsCreateRuleDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Lifecycle Rule
            </Button>
            <CreateLifecycleRuleDialog
              open={isCreateRuleDialogOpen}
              onOpenChange={setIsCreateRuleDialogOpen}
              onSuccess={() => {
                // In a real implementation, this would refresh the transitions list
                console.log("Lifecycle rule created successfully");
              }}
            />
          </div>
        </div>
      </section>

      {/* ==========================================================================
          SECTION 1: LIFECYCLE STATES OVERVIEW
          ========================================================================== */}
      <LifecycleStatesSection />

      {/* ==========================================================================
          SECTION 2: TRANSITION RULES
          ========================================================================== */}
      <TransitionRulesSection />

      {/* ==========================================================================
          SECTION 3: AUTOMATION & POLICY
          ========================================================================== */}
      <AutomationPolicySection />
    </div>
  );
}
