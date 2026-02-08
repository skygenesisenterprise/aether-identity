"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import {
  Clock,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PendingReview {
  id: string;
  type: "access_request" | "role_assignment" | "policy_change";
  requester: string;
  description: string;
  requestedAt: string;
  priority: "low" | "medium" | "high";
}

interface PendingReviewsListProps {
  reviews: PendingReview[];
  maxDisplay?: number;
}

export function PendingReviewsList({
  reviews,
  maxDisplay = 4,
}: PendingReviewsListProps) {
  const visibleReviews = reviews.slice(0, maxDisplay);

  const getTypeIcon = (type: PendingReview["type"]) => {
    switch (type) {
      case "access_request":
        return <Clock className="h-3.5 w-3.5" />;
      case "role_assignment":
        return <UserCheck className="h-3.5 w-3.5" />;
      case "policy_change":
        return <ShieldAlert className="h-3.5 w-3.5" />;
      default:
        return <Clock className="h-3.5 w-3.5" />;
    }
  };

  const getPriorityColor = (priority: PendingReview["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-500/10 border-red-500/30";
      case "medium":
        return "text-amber-500 bg-amber-500/10 border-amber-500/30";
      case "low":
        return "text-blue-500 bg-blue-500/10 border-blue-500/30";
      default:
        return "text-slate-500 bg-slate-500/10";
    }
  };

  const highPriorityCount = reviews.filter((r) => r.priority === "high").length;

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium">
              Pending Reviews
            </CardTitle>
            {highPriorityCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {highPriorityCount} urgent
              </Badge>
            )}
          </div>
          <Badge variant="secondary" className="text-xs">
            {reviews.length} pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {visibleReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
            <p className="text-sm font-medium text-emerald-600">
              All Caught Up
            </p>
            <p className="text-xs text-muted-foreground">
              No pending reviews at this time
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleReviews.map((review) => (
              <div
                key={review.id}
                className={cn(
                  "p-3 rounded-lg border",
                  getPriorityColor(review.priority),
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getTypeIcon(review.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">
                        {review.description}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase shrink-0"
                      >
                        {review.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Requested by {review.requester} • {review.requestedAt}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="h-7 text-xs"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {reviews.length > maxDisplay && (
              <Link
                href="/admin/reviews"
                className="flex items-center justify-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors pt-2"
              >
                View all {reviews.length} pending
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
