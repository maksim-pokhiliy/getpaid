"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@app/shared/ui/toast";
import { useConfirmDialog } from "@app/shared/ui/confirm-dialog";
import { useAnnounce } from "@app/shared/ui/screen-reader-announcer";
import {
  useInvoices,
  useDeleteInvoice,
  useDuplicateInvoice,
  usePrefetchInvoice,
  invoicesApi,
} from "@app/features/invoices";
import { ApiError } from "@app/shared/api";
import { exportInvoicesToCSV } from "@app/shared/lib/export";
import { useVirtualList, useDebouncedValue } from "@app/shared/hooks";
import { queryKeys } from "@app/shared/config/query";
import { SEARCH } from "@app/shared/config/config";
import { useQueryClient } from "@tanstack/react-query";
import type { InvoiceListItem } from "@app/shared/schemas/api";

function useInvoicesFiltering(invoices: InvoiceListItem[] | undefined, initialStatus: string) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>(initialStatus);
  const [sortColumn, setSortColumn] = React.useState<string>("createdAt");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");

  const debouncedSearch = useDebouncedValue(searchQuery, SEARCH.DEBOUNCE_MS);

  const filteredInvoices = React.useMemo(() => {
    if (!invoices) {
      return [];
    }
    const filtered = invoices.filter((invoice) => {
      const q = debouncedSearch.toLowerCase();
      const matchesSearch =
        q === "" ||
        invoice.publicId.toLowerCase().includes(q) ||
        invoice.client.name.toLowerCase().includes(q) ||
        invoice.client.email.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "ALL" || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    return filtered.sort((a, b) => {
      const comparison = compareByColumn(a, b, sortColumn);
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [invoices, debouncedSearch, statusFilter, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortColumn,
    sortDirection,
    debouncedSearch,
    filteredInvoices,
    handleSort,
  };
}

function compareByColumn(a: InvoiceListItem, b: InvoiceListItem, column: string): number {
  switch (column) {
    case "publicId":
      return a.publicId.localeCompare(b.publicId);
    case "client":
      return a.client.name.localeCompare(b.client.name);
    case "total":
      return a.total - b.total;
    case "dueDate":
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    case "status":
      return a.status.localeCompare(b.status);
    case "createdAt":
    default:
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  }
}

function useInvoicesPagination(
  filteredInvoices: InvoiceListItem[],
  debouncedSearch: string,
  statusFilter: string
) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    setPage(0);
  }, [debouncedSearch, statusFilter]);

  const paginatedInvoices = React.useMemo(() => {
    if (showAll) {
      return filteredInvoices;
    }
    const start = page * rowsPerPage;
    return filteredInvoices.slice(start, start + rowsPerPage);
  }, [filteredInvoices, page, rowsPerPage, showAll]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    page,
    rowsPerPage,
    showAll,
    setShowAll,
    paginatedInvoices,
    handleChangePage,
    handleChangeRowsPerPage,
  };
}

function useInvoiceSelection(filteredInvoices: InvoiceListItem[], announce: (msg: string) => void) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (selectedIds.size > 0) {
      announce(`${selectedIds.size} invoice${selectedIds.size !== 1 ? "s" : ""} selected`);
    }
  }, [selectedIds.size, announce]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    const visibleIds = filteredInvoices.map((inv) => inv.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
    setSelectedIds(allSelected ? new Set() : new Set(visibleIds));
  };

  const clearSelection = () => setSelectedIds(new Set());

  return { selectedIds, setSelectedIds, handleToggleSelect, handleToggleSelectAll, clearSelection };
}

function useInvoiceMenuActions(
  invoices: InvoiceListItem[] | undefined,
  confirm: ReturnType<typeof useConfirmDialog>["confirm"],
  toast: ReturnType<typeof useToast>,
  router: ReturnType<typeof useRouter>,
  deleteMutation: ReturnType<typeof useDeleteInvoice>,
  duplicateMutation: ReturnType<typeof useDuplicateInvoice>
) {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = React.useState<string | null>(null);

  const selectedInvoice = invoices?.find((inv) => inv.id === selectedInvoiceId);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, invoiceId: string) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedInvoiceId(invoiceId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedInvoiceId(null);
  };

  const handleDelete = () => {
    if (!selectedInvoice) {
      return;
    }
    handleMenuClose();
    confirm({
      title: "Delete Invoice",
      message: `Are you sure you want to delete invoice #${selectedInvoice.publicId}? This action cannot be undone.`,
      confirmText: "Delete",
      confirmColor: "error",
      onConfirm: async () => {
        await deleteMutation.mutateAsync(selectedInvoice.id);
        toast.success("Invoice deleted successfully");
      },
    });
  };

  const handleDuplicate = () => {
    if (!selectedInvoice) {
      return;
    }
    handleMenuClose();
    duplicateMutation.mutate(selectedInvoice.id, {
      onSuccess: (newInvoice) => {
        toast.success("Invoice duplicated successfully");
        router.push(`/app/invoices/${newInvoice.id}`);
      },
      onError: (err) => {
        toast.error(err instanceof ApiError ? err.message : "Failed to duplicate invoice");
      },
    });
  };

  const handleViewDetails = () => {
    if (!selectedInvoice) {
      return;
    }
    handleMenuClose();
    router.push(`/app/invoices/${selectedInvoice.id}`);
  };

  const handleEdit = () => {
    if (!selectedInvoice) {
      return;
    }
    handleMenuClose();
    router.push(`/app/invoices/${selectedInvoice.id}/edit`);
  };

  return {
    menuAnchorEl,
    selectedInvoice,
    handleMenuOpen,
    handleMenuClose,
    handleDelete,
    handleDuplicate,
    handleViewDetails,
    handleEdit,
  };
}

function useBulkActions(
  selectedIds: Set<string>,
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>,
  filteredInvoices: InvoiceListItem[],
  confirm: ReturnType<typeof useConfirmDialog>["confirm"],
  toast: ReturnType<typeof useToast>
) {
  const [bulkProcessing, setBulkProcessing] = React.useState(false);
  const queryClient = useQueryClient();

  const runBulkAction = async (
    fn: (id: string) => Promise<unknown>,
    successMsg: string,
    errorMsg: string
  ) => {
    setBulkProcessing(true);
    try {
      await Promise.all([...selectedIds].map(fn));
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices });
      toast.success(successMsg);
      setSelectedIds(new Set());
    } catch {
      toast.error(errorMsg);
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleBulkDelete = () => {
    confirm({
      title: "Delete Invoices",
      message: `Are you sure you want to delete ${selectedIds.size} invoice(s)? This action cannot be undone.`,
      confirmText: "Delete All",
      confirmColor: "error",
      onConfirm: () =>
        runBulkAction(
          invoicesApi.delete,
          `${selectedIds.size} invoice(s) deleted`,
          "Some invoices could not be deleted"
        ),
    });
  };

  const handleBulkExport = () => {
    const selected = filteredInvoices.filter((inv) => selectedIds.has(inv.id));
    exportInvoicesToCSV(selected);
    toast.success(`Exported ${selected.length} invoices`);
  };

  const handleBulkMarkPaid = () =>
    runBulkAction(
      invoicesApi.markPaid,
      `${selectedIds.size} invoice(s) marked as paid`,
      "Some invoices could not be marked as paid"
    );

  const handleBulkSend = () =>
    runBulkAction(
      invoicesApi.send,
      `${selectedIds.size} invoice(s) sent`,
      "Some invoices could not be sent"
    );

  return { bulkProcessing, handleBulkDelete, handleBulkExport, handleBulkMarkPaid, handleBulkSend };
}

export function useInvoicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { confirm, dialogProps } = useConfirmDialog();
  const announce = useAnnounce();

  const { data: invoices, isLoading, error } = useInvoices();
  const deleteMutation = useDeleteInvoice();
  const duplicateMutation = useDuplicateInvoice();
  const prefetchInvoice = usePrefetchInvoice();

  const initialStatus = searchParams.get("status") || "ALL";
  const [filterDrawerOpen, setFilterDrawerOpen] = React.useState(false);

  const filtering = useInvoicesFiltering(invoices, initialStatus);

  React.useEffect(() => {
    if (filtering.debouncedSearch || filtering.statusFilter !== "ALL") {
      announce(
        `${filtering.filteredInvoices.length} invoice${filtering.filteredInvoices.length !== 1 ? "s" : ""} found`
      );
    }
  }, [
    filtering.filteredInvoices.length,
    filtering.debouncedSearch,
    filtering.statusFilter,
    announce,
  ]);

  const pagination = useInvoicesPagination(
    filtering.filteredInvoices,
    filtering.debouncedSearch,
    filtering.statusFilter
  );

  const { parentRef, virtualItems, totalSize } = useVirtualList({
    items: filtering.filteredInvoices,
    estimateSize: 65,
    overscan: 10,
  });

  const selection = useInvoiceSelection(filtering.filteredInvoices, announce);

  const menuActions = useInvoiceMenuActions(
    invoices,
    confirm,
    toast,
    router,
    deleteMutation,
    duplicateMutation
  );

  const bulkActions = useBulkActions(
    selection.selectedIds,
    selection.setSelectedIds,
    filtering.filteredInvoices,
    confirm,
    toast
  );

  const handleExportCSV = () => {
    if (!filtering.filteredInvoices.length) {
      toast.error("No invoices to export");
      return;
    }
    exportInvoicesToCSV(filtering.filteredInvoices);
    toast.success(`Exported ${filtering.filteredInvoices.length} invoices`);
  };

  const handleClearFilters = () => {
    filtering.setSearchQuery("");
    filtering.setStatusFilter("ALL");
  };

  const navigateToNew = () => router.push("/app/invoices/new");
  const navigateToInvoice = (id: string) => router.push(`/app/invoices/${id}`);

  return {
    invoices,
    isLoading,
    error,
    ...filtering,
    ...pagination,
    ...selection,
    ...menuActions,
    ...bulkActions,
    filterDrawerOpen,
    setFilterDrawerOpen,
    parentRef,
    virtualItems,
    totalSize,
    prefetchInvoice,
    dialogProps,
    handleExportCSV,
    handleClearFilters,
    navigateToNew,
    navigateToInvoice,
  };
}
