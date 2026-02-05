"use client";

import { Divider } from "@mui/material";
import { ReminderModeSelector } from "./reminder-mode-selector";
import { ReminderDaysEditor } from "./reminder-days-editor";

type ReminderMode = "AFTER_SENT" | "AFTER_DUE";

interface ReminderScheduleProps {
  mode: ReminderMode;
  onModeChange: (mode: ReminderMode) => void;
  days: number[];
  onDaysChange: (days: number[]) => void;
}

export function ReminderSchedule({
  mode,
  onModeChange,
  days,
  onDaysChange,
}: ReminderScheduleProps) {
  const daysDescription = mode === "AFTER_SENT" ? "after sending" : "after the due date";

  return (
    <>
      <Divider sx={{ my: 3 }} />
      <ReminderModeSelector mode={mode} onChange={onModeChange} />
      <ReminderDaysEditor
        days={days}
        onDaysChange={onDaysChange}
        daysDescription={daysDescription}
      />
    </>
  );
}
