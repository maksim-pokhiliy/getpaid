"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTemplates, templatesApi, type Template } from "@app/features/templates";
import { useOptimisticDelete, useDebouncedValue } from "@app/shared/hooks";
import { useAnnounce } from "@app/shared/ui/screen-reader-announcer";
import { queryKeys } from "@app/shared/config/query";
import { SEARCH } from "@app/shared/config/config";
import { calculateEstimatedTotal } from "./templates-table";

function useSortedTemplates(
  templates: Template[] | undefined,
  pendingIds: Set<string>,
  debouncedSearch: string,
  sortColumn: string,
  sortDirection: "asc" | "desc"
) {
  return React.useMemo(() => {
    if (!templates) {
      return undefined;
    }
    let filtered = templates.filter((t) => !pendingIds.has(t.id));

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query))
      );
    }

    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortColumn) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "items":
          comparison = a.items.length - b.items.length;
          break;
        case "total":
          comparison = calculateEstimatedTotal(a) - calculateEstimatedTotal(b);
          break;
        case "updatedAt":
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        default:
          comparison = 0;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [templates, pendingIds, debouncedSearch, sortColumn, sortDirection]);
}

export function useTemplatesPage() {
  const router = useRouter();
  const { data: templates, isLoading, error } = useTemplates();
  const { deleteItem, pendingIds } = useOptimisticDelete<Template>({
    queryKey: queryKeys.templates,
    getId: (template) => template.id,
    entityName: "Template",
    deleteFn: templatesApi.delete,
  });

  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string | null>(null);
  const [sortColumn, setSortColumn] = React.useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = React.useState("");

  const announce = useAnnounce();
  const debouncedSearch = useDebouncedValue(searchQuery, SEARCH.DEBOUNCE_MS);
  const selectedTemplate = templates?.find((t) => t.id === selectedTemplateId);
  const allTemplatesCount = templates ? templates.filter((t) => !pendingIds.has(t.id)).length : 0;

  const sortedTemplates = useSortedTemplates(
    templates,
    pendingIds,
    debouncedSearch,
    sortColumn,
    sortDirection
  );

  const sortedCount = sortedTemplates?.length ?? 0;
  React.useEffect(() => {
    if (debouncedSearch && sortedCount > 0) {
      announce(`${sortedCount} template${sortedCount !== 1 ? "s" : ""} found`);
    }
  }, [sortedCount, debouncedSearch, announce]);

  const handleMenuOpen = React.useCallback(
    (event: React.MouseEvent<HTMLElement>, templateId: string) => {
      event.stopPropagation();
      setMenuAnchorEl(event.currentTarget);
      setSelectedTemplateId(templateId);
    },
    []
  );

  const handleMenuClose = React.useCallback(() => {
    setMenuAnchorEl(null);
    setSelectedTemplateId(null);
  }, []);

  const handleDelete = React.useCallback(() => {
    if (!selectedTemplate) {
      return;
    }
    const template = selectedTemplate;
    setMenuAnchorEl(null);
    setSelectedTemplateId(null);
    deleteItem(template);
  }, [selectedTemplate, deleteItem]);

  const handleEdit = React.useCallback(() => {
    if (!selectedTemplate) {
      return;
    }
    setMenuAnchorEl(null);
    setSelectedTemplateId(null);
    router.push(`/app/templates/${selectedTemplate.id}/edit`);
  }, [selectedTemplate, router]);

  const handleUseTemplate = React.useCallback(
    (template: Template) => {
      router.push(`/app/invoices/new?templateId=${template.id}`);
    },
    [router]
  );

  const handleSort = React.useCallback(
    (column: string) => {
      if (sortColumn === column) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortColumn(column);
        setSortDirection("asc");
      }
    },
    [sortColumn]
  );

  const navigateToNewTemplate = React.useCallback(() => {
    router.push("/app/templates/new");
  }, [router]);

  return {
    isLoading,
    error,
    sortedTemplates,
    allTemplatesCount,
    searchQuery,
    setSearchQuery,
    menuAnchorEl,
    selectedTemplate,
    sortColumn,
    sortDirection,
    handleMenuOpen,
    handleMenuClose,
    handleDelete,
    handleEdit,
    handleUseTemplate,
    handleSort,
    navigateToNewTemplate,
  };
}
