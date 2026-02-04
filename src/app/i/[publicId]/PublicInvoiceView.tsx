"use client";

import * as React from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Alert,
  Divider,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import PaymentIcon from "@mui/icons-material/Payment";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Invoice {
  id: string;
  publicId: string;
  status: string;
  currency: string;
  subtotal: number;
  total: number;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
  client: {
    name: string;
    email: string;
  };
  items: InvoiceItem[];
  sender: {
    name: string;
    address: string;
    taxId: string;
  };
}

interface Props {
  publicId: string;
  invoice: Invoice;
  hasStripe: boolean;
  justPaid: boolean;
  wasCanceled: boolean;
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

function getStatusColor(status: string) {
  switch (status) {
    case "PAID":
      return "success";
    case "OVERDUE":
      return "error";
    case "SENT":
    case "VIEWED":
      return "info";
    default:
      return "default";
  }
}

export default function PublicInvoiceView({
  publicId,
  invoice,
  hasStripe,
  justPaid,
  wasCanceled,
}: Props) {
  const [viewTracked, setViewTracked] = React.useState(false);
  const [isPayLoading, setIsPayLoading] = React.useState(false);

  React.useEffect(() => {
    if (!viewTracked) {
      fetch(`/api/public/invoices/${publicId}/viewed`, {
        method: "POST",
      }).catch(console.error);
      setViewTracked(true);
    }
  }, [publicId, viewTracked]);

  const handlePrint = () => {
    window.print();
  };

  const handlePay = async () => {
    setIsPayLoading(true);
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: invoice.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setIsPayLoading(false);
    }
  };

  const isPaid = invoice.status === "PAID";
  const isPayable = !isPaid && hasStripe;
  const isOverdue = invoice.status === "OVERDUE";

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {justPaid && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Payment successful! Thank you for your payment.
        </Alert>
      )}

      {wasCanceled && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Payment was canceled. You can try again when ready.
        </Alert>
      )}

      <Paper
        sx={{
          p: 4,
          "@media print": {
            boxShadow: "none",
            p: 0,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 4,
            "@media print": {
              mb: 2,
            },
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Invoice
            </Typography>
            <Typography variant="body2" color="text.secondary">
              #{invoice.publicId}
            </Typography>
          </Box>
          <Chip
            label={invoice.status}
            color={getStatusColor(invoice.status) as "success" | "error" | "info" | "default"}
            sx={{
              "@media print": {
                display: "none",
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              From
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {invoice.sender.name}
            </Typography>
            {invoice.sender.address && (
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                {invoice.sender.address}
              </Typography>
            )}
            {invoice.sender.taxId && (
              <Typography variant="body2" color="text.secondary">
                Tax ID: {invoice.sender.taxId}
              </Typography>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              To
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {invoice.client.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {invoice.client.email}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 4, mb: 4 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Invoice Date
            </Typography>
            <Typography variant="body1">{formatDate(invoice.createdAt)}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Due Date
            </Typography>
            <Typography variant="body1" color={isOverdue ? "error.main" : "text.primary"}>
              {formatDate(invoice.dueDate)}
            </Typography>
          </Box>
          {invoice.paidAt && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Paid Date
              </Typography>
              <Typography variant="body1" color="success.main">
                {formatDate(invoice.paidAt)}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(item.amount, invoice.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Box sx={{ width: 250 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography>Subtotal</Typography>
              <Typography>{formatCurrency(invoice.subtotal, invoice.currency)}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">
                {formatCurrency(invoice.total, invoice.currency)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 4,
            justifyContent: "flex-end",
            "@media print": {
              display: "none",
            },
          }}
        >
          <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>
            Print / Save as PDF
          </Button>

          {isPayable && (
            <Button
              variant="contained"
              startIcon={<PaymentIcon />}
              onClick={handlePay}
              disabled={isPayLoading}
            >
              {isPayLoading ? "Loading..." : "Pay Now"}
            </Button>
          )}

          {isPaid && (
            <Button variant="contained" color="success" disabled>
              Paid
            </Button>
          )}
        </Box>
      </Paper>

      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{
          mt: 4,
          "@media print": {
            display: "none",
          },
        }}
      >
        Powered by Invox
      </Typography>
    </Container>
  );
}
