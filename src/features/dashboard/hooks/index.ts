"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys, STALE_TIME } from "@app/shared/config/query";
import { analyticsApi } from "../api";

export function useAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics,
    queryFn: analyticsApi.get,
    staleTime: STALE_TIME.medium,
  });
}
