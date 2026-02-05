import { fetchApi } from "@app/shared/api/base";

export interface TemplateItem {
  id: string;
  templateId: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

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
  items: TemplateItem[];
}

export interface CreateTemplateInput {
  name: string;
  description?: string;
  currency?: string;
  discount?: {
    type: "PERCENTAGE" | "FIXED";
    value: number;
  };
  taxRate?: number;
  notes?: string;
  dueDays?: number;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface UpdateTemplateInput {
  name?: string;
  description?: string;
  currency?: string;
  discount?: {
    type: "PERCENTAGE" | "FIXED";
    value: number;
  } | null;
  taxRate?: number;
  notes?: string;
  dueDays?: number;
  items?: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export const templatesApi = {
  list: () => fetchApi<Template[]>("/api/templates"),

  get: (id: string) => fetchApi<Template>(`/api/templates/${id}`),

  create: (data: CreateTemplateInput) =>
    fetchApi<Template>("/api/templates", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateTemplateInput) =>
    fetchApi<Template>(`/api/templates/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/api/templates/${id}`, {
      method: "DELETE",
    }),
};
