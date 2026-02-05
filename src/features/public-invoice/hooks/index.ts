"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { queryKeys, STALE_TIME } from "@app/shared/config/query";
import { publicApi } from "../api";

export function usePublicInvoice(publicId: string) {
  return useQuery({
    queryKey: queryKeys.publicInvoice(publicId),
    queryFn: () => publicApi.getInvoice(publicId),
    staleTime: STALE_TIME.medium,
  });
}

export function useMarkInvoiceViewed() {
  return useMutation({
    mutationFn: (publicId: string) => publicApi.markViewed(publicId),
  });
}
