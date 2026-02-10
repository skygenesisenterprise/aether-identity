import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { Button } from "@/components/dashboard/ui/button";
import { Input } from "@/components/dashboard/ui/input";
import { Label } from "@/components/dashboard/ui/label";
import { Building2, MapPin, FileText, Edit2, Save, X } from "lucide-react";
import { useState } from "react";

export interface BillingAddress {
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  vatNumber: string;
  taxId: string;
}

interface BillingInfoProps {
  address: BillingAddress;
  onSave?: (address: BillingAddress) => void;
}

export function BillingInfo({ address, onSave }: BillingInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BillingAddress>(address);

  const handleSave = () => {
    onSave?.(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(address);
    setIsEditing(false);
  };

  const updateField = (field: keyof BillingAddress, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Billing Information
            </CardTitle>
            <CardDescription className="text-sm">
              Company details for invoices and tax purposes
            </CardDescription>
          </div>
          {!isEditing && onSave && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="companyName">Company Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyName"
                    value={formData.companyName || ""}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder="Acme Corporation"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="addressLine1"
                    value={formData.addressLine1}
                    onChange={(e) =>
                      updateField("addressLine1", e.target.value)
                    }
                    placeholder="123 Business Street"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                <Input
                  id="addressLine2"
                  value={formData.addressLine2 || ""}
                  onChange={(e) => updateField("addressLine2", e.target.value)}
                  placeholder="Suite 456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="San Francisco"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State / Province</Label>
                <Input
                  id="state"
                  value={formData.state || ""}
                  onChange={(e) => updateField("state", e.target.value)}
                  placeholder="CA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => updateField("postalCode", e.target.value)}
                  placeholder="94102"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  placeholder="United States"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vatNumber">
                  VAT Number{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="vatNumber"
                    value={formData.vatNumber || ""}
                    onChange={(e) => updateField("vatNumber", e.target.value)}
                    placeholder="EU123456789"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">
                  Tax ID{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="taxId"
                    value={formData.taxId || ""}
                    onChange={(e) => updateField("taxId", e.target.value)}
                    placeholder="12-3456789"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {address.companyName && (
              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {address.companyName}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>
                  {address.city}
                  {address.state && `, ${address.state}`} {address.postalCode}
                </p>
                <p>{address.country}</p>
              </div>
            </div>

            {(address.vatNumber || address.taxId) && (
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  {address.vatNumber && (
                    <p className="text-muted-foreground">
                      VAT: {address.vatNumber}
                    </p>
                  )}
                  {address.taxId && (
                    <p className="text-muted-foreground">
                      Tax ID: {address.taxId}
                    </p>
                  )}
                </div>
              </div>
            )}

            {!address.companyName && !address.addressLine1 && !address.city && (
              <div className="text-center py-4 text-muted-foreground">
                <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No billing information set</p>
                <p className="text-xs mt-1">
                  Add your company details for accurate invoicing
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
