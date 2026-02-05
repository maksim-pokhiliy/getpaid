"use client";

import { Box, Typography, alpha, useTheme } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

export function PaymentsTab() {
  const theme = useTheme();

  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
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
        <AccountBalanceIcon sx={{ fontSize: 40, color: "primary.main" }} />
      </Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Payment Tracking
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: "auto" }}>
        Record payments manually when your clients pay via bank transfer, cash, or other methods.
        Payment tracking is available directly on each invoice.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Open Banking integration coming soon for automatic payment detection.
      </Typography>
    </Box>
  );
}
