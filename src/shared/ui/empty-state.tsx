"use client";

import { Box, Paper, Typography, alpha, useTheme } from "@mui/material";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  dashed?: boolean;
}

export function EmptyState({ icon, title, description, action, dashed = false }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 8,
        textAlign: "center",
        borderRadius: 3,
        bgcolor: alpha(theme.palette.primary.main, 0.02),
        ...(dashed && {
          border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
        }),
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
        {icon}
      </Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: action ? 3 : 0, maxWidth: 400, mx: "auto" }}
      >
        {description}
      </Typography>
      {action}
    </Paper>
  );
}
