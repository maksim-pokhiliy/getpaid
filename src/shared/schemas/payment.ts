import { z } from "zod";

export const paymentMethodSchema = z.enum(["MANUAL", "BANK_TRANSFER", "CASH", "OTHER"]);

export const recordPaymentSchema = z.object({
  amount: z.number().positive(),
  method: paymentMethodSchema,
  note: z.string().optional(),
  paidAt: z.string().optional(),
});

export const recordPaymentApiSchema = z.object({
  amount: z.number().positive(),
  method: paymentMethodSchema,
  note: z.string().optional(),
  paidAt: z.coerce.date().optional(),
});

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
