"use client";

import { Box, Typography } from "@mui/material";

import { ColorPicker } from "./color-picker";

interface BrandColorsProps {
  primaryColor: string;
  accentColor: string;
  onPrimaryChange: (value: string) => void;
  onAccentChange: (value: string) => void;
}

export function BrandColors({
  primaryColor,
  accentColor,
  onPrimaryChange,
  onAccentChange,
}: BrandColorsProps) {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
        Brand Colors
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
        <ColorPicker label="Primary Color" value={primaryColor} onChange={onPrimaryChange} />
        <ColorPicker label="Accent Color" value={accentColor} onChange={onAccentChange} />
      </Box>
    </Box>
  );
}
