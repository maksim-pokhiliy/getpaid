"use client";

import * as React from "react";
import { useClients, clientsApi } from "@app/features/clients";
import { useOptimisticDelete, useDebouncedValue } from "@app/shared/hooks";
import { useAnnounce } from "@app/shared/ui/screen-reader-announcer";
import { queryKeys } from "@app/shared/config/query";
import { PAGINATION, SEARCH } from "@app/shared/config/config";
import type { Client } from "@app/shared/schemas/api";

function filterAndSortClients(
  clients: Client[] | undefined,
  pendingIds: Set<string>,
  search: string,
  sortColumn: string,
  sortDirection: "asc" | "desc"
): Client[] {
  if (!clients) {
    return [];
  }
  const lowerSearch = search.toLowerCase();
  const filtered = clients.filter((client) => {
    if (pendingIds.has(client.id)) {
      return false;
    }
    return (
      search === "" ||
      client.name.toLowerCase().includes(lowerSearch) ||
      client.email.toLowerCase().includes(lowerSearch)
    );
  });
  return filtered.sort((a, b) => {
    let comparison = 0;
    switch (sortColumn) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "email":
        comparison = a.email.localeCompare(b.email);
        break;
      case "createdAt":
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });
}

export function useClientsPage() {
  const { data: clients, isLoading, error } = useClients();
  const { deleteItem, pendingIds } = useOptimisticDelete({
    queryKey: queryKeys.clients,
    getId: (client: { id: string }) => client.id,
    entityName: "Client",
    deleteFn: clientsApi.delete,
  });

  const announce = useAnnounce();
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedClientId, setSelectedClientId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [sortColumn, setSortColumn] = React.useState<string>("name");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(PAGINATION.DEFAULT_PAGE_SIZE);

  const debouncedSearch = useDebouncedValue(searchQuery, SEARCH.DEBOUNCE_MS);
  const selectedClient = clients?.find((c) => c.id === selectedClientId);

  const filteredClients = React.useMemo(
    () => filterAndSortClients(clients, pendingIds, debouncedSearch, sortColumn, sortDirection),
    [clients, pendingIds, debouncedSearch, sortColumn, sortDirection]
  );

  React.useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  React.useEffect(() => {
    if (debouncedSearch) {
      announce(`${filteredClients.length} client${filteredClients.length !== 1 ? "s" : ""} found`);
    }
  }, [filteredClients.length, debouncedSearch, announce]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, clientId: string) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedClientId(clientId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedClientId(null);
  };

  const handleDelete = () => {
    if (!selectedClient) {
      return;
    }
    const client = selectedClient;
    handleMenuClose();
    deleteItem(client);
  };

  const handleEdit = () => {
    setMenuAnchorEl(null);
    setEditDialogOpen(true);
  };

  return {
    clients,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    createDialogOpen,
    setCreateDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    filteredClients,
    selectedClient,
    selectedClientId,
    setSelectedClientId,
    menuAnchorEl,
    handleSort,
    handleMenuOpen,
    handleMenuClose,
    handleDelete,
    handleEdit,
    sortColumn,
    sortDirection,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
  };
}
