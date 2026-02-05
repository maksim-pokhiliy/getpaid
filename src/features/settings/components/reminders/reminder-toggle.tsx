"use client";

import { Box, FormControlLabel, Switch, Typography } from "@mui/material";

interface ReminderToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function ReminderToggle({ enabled, onChange }: ReminderToggleProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <FormControlLabel
        control={
          <Switch checked={enabled} onChange={(e) => onChange(e.target.checked)} color="primary" />
        }
        label={
          <Box>
            <Typography fontWeight={500}>Enable automatic reminders</Typography>
            <Typography variant="body2" color="text.secondary">
              Automatically send payment reminders for unpaid invoices
            </Typography>
          </Box>
        }
        sx={{ alignItems: "flex-start", ml: 0 }}
      />
    </Box>
  );
}
