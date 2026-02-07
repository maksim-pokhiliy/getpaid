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

export const STATUS_COLORS: Record<string, string> = {
  PAID: "#10b981",
  OVERDUE: "#ef4444",
  SENT: "#3b82f6",
  VIEWED: "#3b82f6",
  DRAFT: "#94a3b8",
  PARTIALLY_PAID: "#f59e0b",
};
