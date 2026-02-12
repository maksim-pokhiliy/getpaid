import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys, STALE_TIME } from "@app/shared/config/query";

import { type TimeEntriesSearchInput, timeTrackingApi } from "../api";

export function useTimeTrackingProviders() {
  return useQuery({
    queryKey: queryKeys.timeTrackingProviders,
    queryFn: timeTrackingApi.getProviders,
    staleTime: STALE_TIME.long,
  });
}

export function useTimeTrackingConnections() {
  return useQuery({
    queryKey: queryKeys.timeTrackingConnections,
    queryFn: timeTrackingApi.getConnections,
    staleTime: STALE_TIME.medium,
  });
}

export function useConnectProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ provider, token }: { provider: string; token: string }) =>
      timeTrackingApi.connect(provider, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timeTrackingConnections });
    },
  });
}

export function useDisconnectProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectionId: string) => timeTrackingApi.disconnect(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timeTrackingConnections });
    },
  });
}

export function useWorkspaces(provider: string | null) {
  return useQuery({
    queryKey: queryKeys.timeTrackingWorkspaces(provider ?? ""),
    queryFn: () => timeTrackingApi.getWorkspaces(provider as string),
    enabled: !!provider,
    staleTime: STALE_TIME.long,
  });
}

export function useProjects(provider: string | null, workspaceId: string | null) {
  return useQuery({
    queryKey: queryKeys.timeTrackingProjects(provider ?? "", workspaceId ?? ""),
    queryFn: () => timeTrackingApi.getProjects(provider as string, workspaceId as string),
    enabled: !!provider && !!workspaceId,
    staleTime: STALE_TIME.medium,
  });
}

export function useSearchTimeEntries() {
  return useMutation({
    mutationFn: (input: TimeEntriesSearchInput) => timeTrackingApi.searchTimeEntries(input),
  });
}
