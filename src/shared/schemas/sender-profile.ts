import { z } from "zod";

// Form schema for React Hook Form
export const senderProfileFormSchema = z
  .object({
    companyName: z.string().optional(),
    displayName: z.string().optional(),
    emailFrom: z.string().optional(),
    address: z.string().optional(),
    taxId: z.string().optional(),
    defaultCurrency: z.string(),
  })
  .refine((data) => data.companyName || data.displayName, {
    message: "Either company name or display name is required",
    path: ["companyName"],
  });

// API schema
export const senderProfileSchema = z.object({
  companyName: z.string().optional(),
  displayName: z.string().optional(),
  emailFrom: z.string().optional(),
  address: z.string().optional(),
  taxId: z.string().optional(),
  defaultCurrency: z.string().default("USD"),
});

export const createSenderProfileSchema = senderProfileSchema.refine(
  (data) =>
    (data.companyName && data.companyName.length > 0) ||
    (data.displayName && data.displayName.length > 0),
  {
    message: "Either company name or display name is required",
    path: ["companyName"],
  }
);

export type SenderProfileFormInput = z.infer<typeof senderProfileFormSchema>;
export type SenderProfileInput = z.infer<typeof senderProfileSchema>;
