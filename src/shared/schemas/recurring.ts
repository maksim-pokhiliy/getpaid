import { z } from "zod";
import { VALIDATION } from "@app/shared/config/config";

export const recurringFrequencySchema = z.enum([
  "WEEKLY",
  "BIWEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
]);

export const recurringStatusSchema = z.enum(["ACTIVE", "PAUSED", "CANCELED"]);

export const recurringItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
});

export const createRecurringSchema = z.object({
  clientId: z.string().min(1),
  name: z.string().min(1),
  frequency: recurringFrequencySchema,
  currency: z.string().default("USD"),
  discount: z
    .object({
      type: z.enum(["PERCENTAGE", "FIXED"]),
      value: z.number().min(0),
    })
    .optional(),
  taxRate: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
  dueDays: z.number().min(1).max(VALIDATION.MAX_DUE_DAYS).optional(),
  autoSend: z.boolean().optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  items: z.array(recurringItemSchema).min(1),
});

export const createRecurringApiSchema = createRecurringSchema.extend({
  startDate: z.string().transform((s) => new Date(s)),
  endDate: z
    .string()
    .transform((s) => new Date(s))
    .optional(),
});

export const updateRecurringSchema = z.object({
  name: z.string().min(1).optional(),
  frequency: recurringFrequencySchema.optional(),
  status: recurringStatusSchema.optional(),
  currency: z.string().optional(),
  discount: z
    .object({
      type: z.enum(["PERCENTAGE", "FIXED"]),
      value: z.number().min(0),
    })
    .nullable()
    .optional(),
  taxRate: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
  dueDays: z.number().min(1).max(VALIDATION.MAX_DUE_DAYS).optional(),
  autoSend: z.boolean().optional(),
  nextRunAt: z.string().optional(),
  endDate: z.string().nullable().optional(),
  items: z.array(recurringItemSchema).optional(),
});

export const updateRecurringApiSchema = updateRecurringSchema.extend({
  nextRunAt: z
    .string()
    .transform((s) => new Date(s))
    .optional(),
  endDate: z
    .string()
    .transform((s) => new Date(s))
    .nullable()
    .optional(),
});

export type RecurringFrequency = z.infer<typeof recurringFrequencySchema>;
export type RecurringStatus = z.infer<typeof recurringStatusSchema>;
export const recurringFormSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  name: z.string().min(1, "Name is required"),
  frequency: recurringFrequencySchema,
  currency: z.string(),
  discountType: z.enum(["PERCENTAGE", "FIXED", "NONE"]),
  discountValue: z.number().min(0),
  taxRate: z.number().min(0).max(100),
  notes: z.string().optional(),
  dueDays: z.number().min(1).max(VALIDATION.MAX_DUE_DAYS),
  autoSend: z.boolean(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  items: z.array(recurringItemSchema).min(1, "At least one item is required"),
});

export type RecurringFormData = z.infer<typeof recurringFormSchema>;
export type CreateRecurringInput = z.infer<typeof createRecurringSchema>;
export type UpdateRecurringInput = z.infer<typeof updateRecurringSchema>;

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
