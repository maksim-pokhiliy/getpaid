"use client";

import { Box, Typography } from "@mui/material";

interface PaymentsTabProps {
  children: React.ReactNode;
}

export function PaymentsTab({ children }: PaymentsTabProps) {
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Connected Banks
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Connect your bank to automatically detect incoming payments
        </Typography>
      </Box>
      {children}
    </Box>
  );
}
