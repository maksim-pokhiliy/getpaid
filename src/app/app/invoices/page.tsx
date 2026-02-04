"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AppLayout } from "@app/components/layout/AppLayout";

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

export default function InvoicesPage() {
  const router = useRouter();

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Invoices
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("/app/invoices/new")}
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
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : invoices && invoices.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice #</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => router.push(`/app/invoices/${invoice.id}`)}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {invoice.publicId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{invoice.client.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {invoice.client.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatCurrency(invoice.total, invoice.currency)}</TableCell>
                  <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.status}
                      size="small"
                      color={
                        getStatusColor(invoice.status) as "success" | "error" | "info" | "default"
                      }
                    />
                  </TableCell>
                  <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No invoices yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first invoice to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push("/app/invoices/new")}
          >
            Create Invoice
          </Button>
        </Paper>
      )}
    </AppLayout>
  );
}
