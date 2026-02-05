"use client";

import { Box, TextField, Typography } from "@mui/material";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Box
          component="input"
          type="color"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          sx={{
            width: 48,
            height: 48,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            cursor: "pointer",
            p: 0.5,
          }}
        />
        <TextField
          size="small"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{ width: 120 }}
          slotProps={{
            htmlInput: { pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" },
          }}
        />
      </Box>
    </Box>
  );
}
