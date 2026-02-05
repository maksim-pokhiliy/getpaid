import { fetchApi } from "@app/shared/api/base";
import type { PublicInvoice } from "@app/shared/schemas/api";

export const publicApi = {
  getInvoice: (publicId: string) => fetchApi<PublicInvoice>(`/api/public/invoices/${publicId}`),

  markViewed: (publicId: string) =>
    fetchApi<void>(`/api/public/invoices/${publicId}/viewed`, {
      method: "POST",
    }),
};
