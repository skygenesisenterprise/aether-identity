import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { Badge } from "@/components/dashboard/ui/badge";
import { Button } from "@/components/dashboard/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/dashboard/ui/table";
import { Download, FileText, Receipt, CreditCard } from "lucide-react";

export interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  currency: string;
  status: "paid" | "open" | "void" | "uncollectible";
  description: string;
  pdfUrl?: string;
}

interface InvoiceHistoryProps {
  invoices: Invoice[];
  onDownload?: (invoice: Invoice) => void;
}

const statusConfig = {
  paid: { label: "Paid", variant: "default" as const },
  open: { label: "Pending", variant: "secondary" as const },
  void: { label: "Void", variant: "outline" as const },
  uncollectible: { label: "Failed", variant: "destructive" as const },
};

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function InvoiceHistory({ invoices, onDownload }: InvoiceHistoryProps) {
  const sortedInvoices = [...invoices].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Billing History
            </CardTitle>
            <CardDescription className="text-sm">
              View and download your past invoices
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedInvoices.length === 0 ? (
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm font-medium text-foreground">
              No invoices yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Invoices will appear here once your subscription is billed
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedInvoices.map((invoice) => {
                  const status = statusConfig[invoice.status];
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        #{invoice.number}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(invoice.date)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {invoice.description || "Subscription"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatAmount(invoice.amount, invoice.currency)}
                      </TableCell>
                      <TableCell>
                        {onDownload && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onDownload(invoice)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
