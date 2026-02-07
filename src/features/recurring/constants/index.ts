import type { RecurringStatus } from "@app/features/recurring";

export const RECURRING_FREQUENCY_LABELS: Record<string, string> = {
  WEEKLY: "Weekly",
  BIWEEKLY: "Bi-weekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
};

export const RECURRING_STATUS_CONFIG: Record<
  RecurringStatus,
  { color: "success" | "warning" | "error"; label: string }
> = {
  ACTIVE: { color: "success", label: "Active" },
  PAUSED: { color: "warning", label: "Paused" },
  CANCELED: { color: "error", label: "Canceled" },
};
