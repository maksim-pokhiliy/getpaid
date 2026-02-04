"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import LinkIcon from "@mui/icons-material/Link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { AppLayout } from "@app/components/layout/AppLayout";

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
  sentAt: string | null;
  viewedAt: string | null;
  paidAt: string | null;
  paymentMethod: string | null;
  createdAt: string;
  client: {
    name: string;
    email: string;
  };
  items: InvoiceItem[];
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

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
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
    case "DRAFT":
      return "default";
    default:
      return "default";
  }
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sendDialogOpen, setSendDialogOpen] = React.useState(false);
  const [markPaidDialogOpen, setMarkPaidDialogOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const {
    data: invoice,
    isLoading,
    error,
  } = useQuery<Invoice>({
    queryKey: ["invoice", params.id],
    queryFn: async () => {
      const response = await fetch(`/api/invoices/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch invoice");
      return response.json();
    },
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/invoices/${params.id}/send`, {
        method: "POST",
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error?.message || "Failed to send invoice");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", params.id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setSendDialogOpen(false);
      setSnackbarMessage("Invoice sent successfully!");
      setSnackbarOpen(true);
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/invoices/${params.id}/mark-paid`, {
        method: "POST",
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error?.message || "Failed to mark invoice as paid");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", params.id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setMarkPaidDialogOpen(false);
      setSnackbarMessage("Invoice marked as paid!");
      setSnackbarOpen(true);
    },
  });

  const copyPublicLink = () => {
    const url = `${window.location.origin}/i/${invoice?.publicId}`;
    navigator.clipboard.writeText(url);
    setSnackbarMessage("Link copied to clipboard!");
    setSnackbarOpen(true);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </AppLayout>
    );
  }

  if (error || !invoice) {
    return (
      <AppLayout>
        <Alert severity="error">Failed to load invoice. Please try again.</Alert>
      </AppLayout>
    );
  }

  const isDraft = invoice.status === "DRAFT";
  const isPaid = invoice.status === "PAID";
  const isOverdue = invoice.status === "OVERDUE";

  return (
    <AppLayout>
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <IconButton onClick={() => router.push("/app/invoices")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
            Invoice #{invoice.publicId}
          </Typography>
          <Chip
            label={invoice.status}
            color={getStatusColor(invoice.status) as "success" | "error" | "info" | "default"}
          />
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
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
                Client
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {invoice.client.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {invoice.client.email}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Details
              </Typography>
              <Typography variant="body2">
                <strong>Created:</strong> {formatDate(invoice.createdAt)}
              </Typography>
              <Typography variant="body2" color={isOverdue ? "error.main" : "text.primary"}>
                <strong>Due:</strong> {formatDate(invoice.dueDate)}
              </Typography>
              {invoice.sentAt && (
                <Typography variant="body2">
                  <strong>Sent:</strong> {formatDateTime(invoice.sentAt)}
                </Typography>
              )}
              {invoice.viewedAt && (
                <Typography variant="body2">
                  <strong>Viewed:</strong> {formatDateTime(invoice.viewedAt)}
                </Typography>
              )}
              {invoice.paidAt && (
                <Typography variant="body2" color="success.main">
                  <strong>Paid:</strong> {formatDateTime(invoice.paidAt)} ({invoice.paymentMethod})
                </Typography>
              )}
            </Box>
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
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>{formatCurrency(invoice.subtotal, invoice.currency)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">
                  {formatCurrency(invoice.total, invoice.currency)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Actions
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {isDraft && (
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={() => setSendDialogOpen(true)}
              >
                Send Invoice
              </Button>
            )}

            {!isDraft && (
              <Button variant="outlined" startIcon={<LinkIcon />} onClick={copyPublicLink}>
                Copy Public Link
              </Button>
            )}

            {!isPaid && (
              <Button
                variant="outlined"
                startIcon={<CheckCircleIcon />}
                onClick={() => setMarkPaidDialogOpen(true)}
              >
                Mark as Paid
              </Button>
            )}

            {!isDraft && (
              <Button
                variant="outlined"
                onClick={() => window.open(`/i/${invoice.publicId}`, "_blank")}
              >
                View Public Page
              </Button>
            )}
          </Box>
        </Paper>
      </Box>

      <Dialog open={sendDialogOpen} onClose={() => setSendDialogOpen(false)}>
        <DialogTitle>Send Invoice</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will send an email to {invoice.client.email} with a link to view and pay the
            invoice.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => sendMutation.mutate()}
            disabled={sendMutation.isPending}
          >
            {sendMutation.isPending ? "Sending..." : "Send"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={markPaidDialogOpen} onClose={() => setMarkPaidDialogOpen(false)}>
        <DialogTitle>Mark as Paid</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will mark the invoice as paid manually. Use this if you received payment outside of
            the Stripe integration.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMarkPaidDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => markPaidMutation.mutate()}
            disabled={markPaidMutation.isPending}
          >
            {markPaidMutation.isPending ? "Processing..." : "Mark as Paid"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </AppLayout>
  );
}
