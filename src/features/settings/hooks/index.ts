"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys, STALE_TIME } from "@app/shared/config/query";
import type { SenderProfileInput } from "@app/shared/schemas";

import { remindersApi, type ReminderSettings, senderProfileApi } from "../api";

export function useSenderProfile() {
  return useQuery({
    queryKey: queryKeys.senderProfile,
    queryFn: senderProfileApi.get,
    staleTime: STALE_TIME.long,
  });
}

export function useCreateSenderProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SenderProfileInput) => senderProfileApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.senderProfile });
    },
  });
}

export function useUpdateSenderProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SenderProfileInput) => senderProfileApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.senderProfile });
    },
  });
}

export function usePrefetchSenderProfile() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.senderProfile,
      queryFn: senderProfileApi.get,
      staleTime: STALE_TIME.long,
    });
  };
}

export function useReminderSettings() {
  return useQuery({
    queryKey: queryKeys.reminderSettings,
    queryFn: remindersApi.get,
    staleTime: STALE_TIME.long,
  });
}

export function useUpdateReminderSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReminderSettings) => remindersApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminderSettings });
    },
  });
}
