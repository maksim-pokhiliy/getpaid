"use client";

import { Box, Divider, Typography } from "@mui/material";

import { formatCurrency } from "@app/shared/lib/format";

interface InvoiceTotalsProps {
  subtotal: number;
  total: number;
  currency: string;
  primaryColor: string;
}

export function InvoiceTotals({ subtotal, total, currency, primaryColor }: InvoiceTotalsProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Box sx={{ minWidth: 280 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography color="text.secondary">Subtotal</Typography>
          <Typography>{formatCurrency(subtotal, currency)}</Typography>
        </Box>
        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight={600}>
            Total Due
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ color: primaryColor }}>
            {formatCurrency(total, currency)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
