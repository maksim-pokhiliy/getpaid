"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys, STALE_TIME } from "@app/shared/config/query";
import type { CreateClientInput, UpdateClientInput } from "@app/shared/schemas";
import type { Client } from "@app/shared/schemas/api";

import { clientsApi } from "../api";

export function useClients() {
  return useQuery({
    queryKey: queryKeys.clients,
    queryFn: clientsApi.list,
    staleTime: STALE_TIME.medium,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientInput) => clientsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientInput }) =>
      clientsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientsApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.clients });
      const previousClients = queryClient.getQueryData<Client[]>(queryKeys.clients);

      queryClient.setQueryData<Client[]>(queryKeys.clients, (old) =>
        old?.filter((client) => client.id !== id)
      );

      return { previousClients };
    },
    onError: (_, __, context) => {
      if (context?.previousClients) {
        queryClient.setQueryData(queryKeys.clients, context.previousClients);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients });
    },
  });
}

export function usePrefetchClients() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.clients,
      queryFn: clientsApi.list,
      staleTime: STALE_TIME.medium,
    });
  };
}
