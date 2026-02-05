import { fetchApi } from "@app/shared/api/base";

export type RecurringFrequency = "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
export type RecurringStatus = "ACTIVE" | "PAUSED" | "CANCELED";

export interface RecurringInvoiceItem {
  id: string;
  recurringInvoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface RecurringInvoice {
  id: string;
  name: string;
  frequency: RecurringFrequency;
  status: RecurringStatus;
  currency: string;
  discountType: "PERCENTAGE" | "FIXED" | null;
  discountValue: number;
  taxRate: number;
  notes: string | null;
  dueDays: number;
  autoSend: boolean;
  nextRunAt: string;
  lastRunAt: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    name: string;
    email: string;
  };
  items: RecurringInvoiceItem[];
}

export interface CreateRecurringInput {
  clientId: string;
  name: string;
  frequency: RecurringFrequency;
  currency?: string;
  discount?: {
    type: "PERCENTAGE" | "FIXED";
    value: number;
  };
  taxRate?: number;
  notes?: string;
  dueDays?: number;
  autoSend?: boolean;
  startDate: string;
  endDate?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface UpdateRecurringInput {
  name?: string;
  frequency?: RecurringFrequency;
  status?: RecurringStatus;
  currency?: string;
  discount?: {
    type: "PERCENTAGE" | "FIXED";
    value: number;
  } | null;
  taxRate?: number;
  notes?: string;
  dueDays?: number;
  autoSend?: boolean;
  nextRunAt?: string;
  endDate?: string | null;
  items?: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export const recurringApi = {
  list: () => fetchApi<RecurringInvoice[]>("/api/recurring"),

  get: (id: string) => fetchApi<RecurringInvoice>(`/api/recurring/${id}`),

  create: (data: CreateRecurringInput) =>
    fetchApi<RecurringInvoice>("/api/recurring", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateRecurringInput) =>
    fetchApi<RecurringInvoice>(`/api/recurring/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/api/recurring/${id}`, {
      method: "DELETE",
    }),

  generate: (id: string) =>
    fetchApi<{ success: boolean; invoiceId: string; publicId: string }>(
      `/api/recurring/${id}/generate`,
      { method: "POST" }
    ),
};
