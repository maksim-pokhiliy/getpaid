import type { Theme } from "@mui/material";

export const STATUS_CONFIG: Record<
  string,
  { color: "success" | "error" | "info" | "warning" | "default"; label: string }
> = {
  PAID: { color: "success", label: "Paid" },
  PARTIALLY_PAID: { color: "warning", label: "Partially Paid" },
  OVERDUE: { color: "error", label: "Overdue" },
  SENT: { color: "info", label: "Sent" },
  VIEWED: { color: "info", label: "Viewed" },
  DRAFT: { color: "default", label: "Draft" },
};

export function getStatusColor(theme: Theme, status: string): string {
  const config = STATUS_CONFIG[status];
  if (!config || config.color === "default") {
    return theme.palette.text.secondary;
  }
  return theme.palette[config.color].main;
}
