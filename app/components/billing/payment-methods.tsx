import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Badge } from "@/components/dashboard/ui/badge";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Building2,
} from "lucide-react";

interface PaymentMethod {
  id: string;
  type: "card" | "bank_transfer" | "paypal";
  brand?: string;
  last4: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
  status: "active" | "expired" | "expiring_soon";
}

interface PaymentMethodsProps {
  methods: PaymentMethod[];
  onAddMethod?: () => void;
  onRemoveMethod?: (id: string) => void;
  onSetDefault?: (id: string) => void;
}

const cardBrands: Record<string, { name: string; color: string }> = {
  visa: { name: "Visa", color: "bg-blue-500" },
  mastercard: { name: "Mastercard", color: "bg-red-500" },
  amex: { name: "American Express", color: "bg-green-500" },
  discover: { name: "Discover", color: "bg-orange-500" },
};

function getStatusBadge(status: PaymentMethod["status"]) {
  switch (status) {
    case "expired":
      return (
        <Badge variant="destructive" className="text-xs">
          <AlertCircle className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    case "expiring_soon":
      return (
        <Badge
          variant="outline"
          className="text-xs border-amber-400 text-amber-400"
        >
          <AlertCircle className="h-3 w-3 mr-1" />
          Expiring soon
        </Badge>
      );
    default:
      return null;
  }
}

function PaymentMethodCard({
  method,
  onRemove,
  onSetDefault,
}: {
  method: PaymentMethod;
  onRemove?: (id: string) => void;
  onSetDefault?: (id: string) => void;
}) {
  const brandInfo = method.brand ? cardBrands[method.brand] : null;
  const statusBadge = getStatusBadge(method.status);

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-lg border",
        method.status === "expired"
          ? "border-destructive/50 bg-destructive/5"
          : "border-border bg-card",
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "h-10 w-16 rounded-md flex items-center justify-center text-white text-xs font-bold",
            brandInfo?.color || "bg-muted-foreground",
          )}
        >
          {method.type === "card" ? (
            brandInfo?.name || "Card"
          ) : method.type === "bank_transfer" ? (
            <Building2 className="h-5 w-5" />
          ) : (
            "PayPal"
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">
              {method.type === "card" ? (
                <>
                  {brandInfo?.name || "Card"} ending in {method.last4}
                </>
              ) : method.type === "bank_transfer" ? (
                <>Bank account ****{method.last4}</>
              ) : (
                <>PayPal account</>
              )}
            </p>
            {method.isDefault && (
              <Badge variant="secondary" className="text-xs">
                <Check className="h-3 w-3 mr-1" />
                Default
              </Badge>
            )}
            {statusBadge}
          </div>
          {method.expMonth && method.expYear && (
            <p className="text-xs text-muted-foreground">
              Expires {method.expMonth.toString().padStart(2, "0")}/
              {method.expYear}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!method.isDefault && method.status !== "expired" && onSetDefault && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSetDefault(method.id)}
          >
            Set as default
          </Button>
        )}
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(method.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function PaymentMethods({
  methods,
  onAddMethod,
  onRemoveMethod,
  onSetDefault,
}: PaymentMethodsProps) {
  const defaultMethod = methods.find((m) => m.isDefault);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Payment Methods
            </CardTitle>
            <CardDescription className="text-sm">
              Manage your payment methods for automatic billing
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onAddMethod}>
            <Plus className="h-4 w-4 mr-2" />
            Add method
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {methods.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm font-medium text-foreground">
              No payment methods
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Add a payment method to enable automatic billing
            </p>
            <Button variant="outline" className="mt-4" onClick={onAddMethod}>
              <Plus className="h-4 w-4 mr-2" />
              Add payment method
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {methods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  onRemove={onRemoveMethod}
                  onSetDefault={onSetDefault}
                />
              ))}
            </div>
            {defaultMethod && (
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Your {defaultMethod.type === "card" ? "card" : "account"}{" "}
                  ending in {defaultMethod.last4} will be charged automatically
                  at the start of each billing period.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
