import { z } from "zod";
import { VALIDATION } from "@app/shared/config/config";

export const templateItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
});

export const createTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
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
  items: z.array(templateItemSchema).min(1),
});

export const updateTemplateSchema = createTemplateSchema.partial().extend({
  discount: z
    .object({
      type: z.enum(["PERCENTAGE", "FIXED"]),
      value: z.number().min(0),
    })
    .nullable()
    .optional(),
});

export type TemplateItem = z.infer<typeof templateItemSchema>;
export const templateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
  discountType: z.enum(["PERCENTAGE", "FIXED", ""]).optional(),
  discountValue: z.number().min(0).optional(),
  taxRate: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
  dueDays: z.number().min(1, "Due days must be at least 1").max(VALIDATION.MAX_DUE_DAYS),
  items: z.array(templateItemSchema).min(1, "At least one item is required"),
});

export type TemplateFormData = z.infer<typeof templateFormSchema>;
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;

export interface Template {
  id: string;
  name: string;
  description: string | null;
  currency: string;
  discountType: "PERCENTAGE" | "FIXED" | null;
  discountValue: number;
  taxRate: number;
  notes: string | null;
  dueDays: number;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    templateId: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
}
