"use client";

import { Box, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import { CardSkeleton } from "@app/shared/ui/loading";
import { STATUS_COLORS, STATUS_CONFIG } from "@app/shared/config/invoice-status";

interface StatusBreakdownProps {
  isLoading: boolean;
  statusCounts: Record<string, number> | undefined;
  clientCount: number;
}

export function StatusBreakdown({ isLoading, statusCounts, clientCount }: StatusBreakdownProps) {
  if (isLoading) {
    return <CardSkeleton />;
  }

  const entries = Object.entries(statusCounts || {});

  if (entries.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No invoice data yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {entries.map(([status, count]) => (
        <Box
          key={status}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            "&:last-child": { borderBottom: "none" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: STATUS_COLORS[status] || "#9ca3af",
              }}
            />
            <Typography variant="body2">{STATUS_CONFIG[status]?.label || status}</Typography>
          </Box>
          <Typography variant="body2" fontWeight={600}>
            {count}
          </Typography>
        </Box>
      ))}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pt: 2,
          mt: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <PeopleIcon fontSize="small" color="action" />
          <Typography variant="body2">Total Clients</Typography>
        </Box>
        <Typography variant="body2" fontWeight={600}>
          {clientCount}
        </Typography>
      </Box>
    </Box>
  );
}
