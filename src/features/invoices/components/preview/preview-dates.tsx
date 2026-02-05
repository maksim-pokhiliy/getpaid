"use client";

import { Box, Typography } from "@mui/material";
import { formatDate } from "@app/shared/lib/format";

interface PreviewDatesProps {
  createdAt: string;
  dueDate: string;
}

export function PreviewDates({ createdAt, dueDate }: PreviewDatesProps) {
  return (
    <Box sx={{ display: "flex", gap: 4, mb: 4 }}>
      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          INVOICE DATE
        </Typography>
        <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5 }}>
          {formatDate(createdAt)}
        </Typography>
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          DUE DATE
        </Typography>
        <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5 }}>
          {formatDate(dueDate)}
        </Typography>
      </Box>
    </Box>
  );
}
