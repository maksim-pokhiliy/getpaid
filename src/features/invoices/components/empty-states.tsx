"use client";

import { Paper, Typography, Button, alpha, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddIcon from "@mui/icons-material/Add";
import { EmptyState } from "@app/shared/ui/empty-state";

interface NoResultsProps {
  onClearFilters: () => void;
}

export function NoInvoicesFound({ onClearFilters }: NoResultsProps) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 6,
        textAlign: "center",
        borderRadius: 3,
        bgcolor: alpha(theme.palette.primary.main, 0.02),
      }}
    >
      <SearchIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
      <Typography variant="h6" fontWeight={600} gutterBottom>
        No invoices found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Try adjusting your search or filter to find what you&apos;re looking for.
      </Typography>
      <Button variant="outlined" onClick={onClearFilters}>
        Clear Filters
      </Button>
    </Paper>
  );
}

interface EmptyInvoicesProps {
  onCreateInvoice: () => void;
}

export function EmptyInvoicesState({ onCreateInvoice }: EmptyInvoicesProps) {
  return (
    <EmptyState
      icon={<ReceiptLongIcon sx={{ fontSize: 40, color: "primary.main" }} />}
      title="No invoices yet"
      description="Create your first invoice and start getting paid faster. Track payments, send reminders, and manage your cash flow all in one place."
      dashed
      action={
        <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={onCreateInvoice}>
          Create Your First Invoice
        </Button>
      }
    />
  );
}
