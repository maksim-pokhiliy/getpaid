"use client";

import { Box, Typography, alpha, useTheme } from "@mui/material";

interface PreviewPartiesProps {
  client: {
    name: string;
    email: string;
  };
}

export function PreviewParties({ client }: PreviewPartiesProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 4,
        mb: 4,
        p: 3,
        borderRadius: 2,
        bgcolor: alpha(theme.palette.primary.main, 0.02),
      }}
    >
      <Box>
        <Typography variant="overline" color="text.secondary" fontWeight={600}>
          From
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Your business info will appear here
        </Typography>
      </Box>
      <Box>
        <Typography variant="overline" color="text.secondary" fontWeight={600}>
          Bill To
        </Typography>
        <Typography variant="h6" fontWeight={600} sx={{ mt: 1 }}>
          {client.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {client.email}
        </Typography>
      </Box>
    </Box>
  );
}
