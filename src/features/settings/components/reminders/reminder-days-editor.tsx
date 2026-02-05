"use client";

import * as React from "react";
import {
  Box,
  Chip,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const MAX_REMINDER_DAYS = 5;
const MIN_DAY = 1;
const MAX_DAY = 90;

interface ReminderDaysEditorProps {
  days: number[];
  onDaysChange: (days: number[]) => void;
  daysDescription: string;
}

export function ReminderDaysEditor({
  days,
  onDaysChange,
  daysDescription,
}: ReminderDaysEditorProps) {
  const theme = useTheme();
  const [newDayInput, setNewDayInput] = React.useState("");

  const handleAddDay = () => {
    const day = parseInt(newDayInput, 10);
    if (!isNaN(day) && day >= MIN_DAY && day <= MAX_DAY && !days.includes(day)) {
      onDaysChange([...days, day].sort((a, b) => a - b));
      setNewDayInput("");
    }
  };

  const handleRemoveDay = (day: number) => {
    if (days.length > 1) {
      onDaysChange(days.filter((d) => d !== day));
    }
  };

  return (
    <>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
        Reminder schedule (days)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Reminders will be sent on these days {daysDescription}
      </Typography>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        {days.map((day) => (
          <Chip
            key={day}
            label={`Day ${day}`}
            onDelete={days.length > 1 ? () => handleRemoveDay(day) : undefined}
            deleteIcon={<CloseIcon />}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              "& .MuiChip-deleteIcon": {
                color: "text.secondary",
                "&:hover": { color: "error.main" },
              },
            }}
          />
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 1, alignItems: "center", maxWidth: 200 }}>
        <TextField
          size="small"
          type="number"
          placeholder="Add day"
          value={newDayInput}
          onChange={(e) => setNewDayInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddDay();
            }
          }}
          slotProps={{ htmlInput: { min: MIN_DAY, max: MAX_DAY } }}
          sx={{ width: 100 }}
        />
        <Tooltip title="Add reminder day">
          <IconButton
            onClick={handleAddDay}
            color="primary"
            size="small"
            disabled={days.length >= MAX_REMINDER_DAYS}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
        Maximum {MAX_REMINDER_DAYS} reminder days ({MIN_DAY}-{MAX_DAY} days)
      </Typography>
    </>
  );
}
