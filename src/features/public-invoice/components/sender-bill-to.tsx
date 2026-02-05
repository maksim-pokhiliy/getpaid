"use client";

import { Box, Typography, alpha } from "@mui/material";

interface SenderBillToProps {
  sender: {
    name: string;
    address: string;
    taxId: string;
  };
  client: {
    name: string;
    email: string;
  };
  primaryColor: string;
}

export function SenderBillTo({ sender, client, primaryColor }: SenderBillToProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 4,
        mb: 4,
        p: 3,
        borderRadius: 2,
        bgcolor: alpha(primaryColor, 0.04),
      }}
    >
      <Box>
        <Typography variant="overline" color="text.secondary" fontWeight={600}>
          From
        </Typography>
        <Typography variant="h6" fontWeight={600} sx={{ mt: 1 }}>
          {sender.name}
        </Typography>
        {sender.address && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ whiteSpace: "pre-line", mt: 0.5 }}
          >
            {sender.address}
          </Typography>
        )}
        {sender.taxId && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Tax ID: {sender.taxId}
          </Typography>
        )}
      </Box>

      <Box>
        <Typography variant="overline" color="text.secondary" fontWeight={600}>
          Bill To
        </Typography>
        <Typography variant="h6" fontWeight={600} sx={{ mt: 1 }}>
          {client.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {client.email}
        </Typography>
      </Box>
    </Box>
  );
}
