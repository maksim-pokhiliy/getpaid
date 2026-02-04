"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  alpha,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { AppLayout } from "@app/components/layout/AppLayout";
import { Breadcrumbs } from "@app/components/navigation/Breadcrumbs";
import { TableSkeleton } from "@app/components/feedback/Loading";

interface Invoice {
  id: string;
  publicId: string;
  status: string;
  currency: string;
  total: number;
  dueDate: string;
  createdAt: string;
  client: {
    name: string;
    email: string;
  };
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
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

const statusConfig: Record<
  string,
  { color: "success" | "error" | "info" | "warning" | "default"; label: string }
> = {
  PAID: { color: "success", label: "Paid" },
  OVERDUE: { color: "error", label: "Overdue" },
  SENT: { color: "info", label: "Sent" },
  VIEWED: { color: "info", label: "Viewed" },
  DRAFT: { color: "default", label: "Draft" },
};

export default function InvoicesPage() {
  const router = useRouter();
  const theme = useTheme();

  const {
    data: invoices,
    isLoading,
    error,
  } = useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: async () => {
      const response = await fetch("/api/invoices");
      if (!response.ok) throw new Error("Failed to fetch invoices");
      return response.json();
    },
  });

  return (
    <AppLayout>
      <Breadcrumbs items={[{ label: "Invoices" }]} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Invoices
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage and track all your invoices
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("/app/invoices/new")}
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          New Invoice
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load invoices. Please try again.
        </Alert>
      )}

      {isLoading ? (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <TableSkeleton rows={5} columns={6} />
        </Paper>
      ) : invoices && invoices.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            "& .MuiTableHead-root": {
              bgcolor: alpha(theme.palette.primary.main, 0.04),
            },
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Invoice #</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => {
                const status = statusConfig[invoice.status] || statusConfig.DRAFT;
                return (
                  <TableRow
                    key={invoice.id}
                    hover
                    sx={{
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                    onClick={() => router.push(`/app/invoices/${invoice.id}`)}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary.main">
                        {invoice.publicId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {invoice.client.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {invoice.client.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(invoice.total, invoice.currency)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(invoice.dueDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={status.label}
                        size="small"
                        color={status.color}
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(invoice.createdAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper
          sx={{
            p: 8,
            textAlign: "center",
            borderRadius: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.02),
            border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <ReceiptLongIcon sx={{ fontSize: 40, color: "primary.main" }} />
          </Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            No invoices yet
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 400, mx: "auto" }}
          >
            Create your first invoice and start getting paid faster. Track payments, send reminders,
            and manage your cash flow all in one place.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => router.push("/app/invoices/new")}
          >
            Create Your First Invoice
          </Button>
        </Paper>
      )}
    </AppLayout>
  );
}
