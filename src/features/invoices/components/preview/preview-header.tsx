"use client";

import { Box, Chip, Typography } from "@mui/material";

interface PreviewHeaderProps {
  publicId: string;
}

export function PreviewHeader({ publicId }: PreviewHeaderProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Invoice
        </Typography>
        <Typography variant="body1" color="text.secondary">
          #{publicId}
        </Typography>
      </Box>
      <Chip label="Draft" color="default" />
    </Box>
  );
}
