"use client";

import * as React from "react";
import { Paper, Table, TableBody, TableContainer, alpha, useTheme } from "@mui/material";
import { InvoicesTableHeader } from "./table-header";
import { InvoicesTableFooter } from "./table-footer";
import { VirtualizedRows, PaginatedRows } from "./table-rows";
import { useTableKeyboardNav } from "@app/shared/hooks";
import { UI } from "@app/shared/config/config";
import type { InvoiceData } from "../invoice-row";

interface VirtualItem {
  index: number;
  start: number;
  end: number;
}

const VIRTUAL_MAX_HEIGHT = 600;

interface InvoicesTableProps {
  filteredInvoices: InvoiceData[];
  paginatedInvoices: InvoiceData[];
  showAll: boolean;
  setShowAll: (show: boolean) => void;
  virtualItems: VirtualItem[];
  totalSize: number;
  parentRef: React.RefObject<HTMLDivElement | null>;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
  onRowClick: (id: string) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, id: string) => void;
  onPrefetch: (id: string) => void;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
}

export function InvoicesTable({
  filteredInvoices,
  paginatedInvoices,
  showAll,
  setShowAll,
  virtualItems,
  totalSize,
  parentRef,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  onMenuOpen,
  onPrefetch,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: InvoicesTableProps) {
  const theme = useTheme();
  const displayedInvoices = showAll ? filteredInvoices : paginatedInvoices;
  const { onKeyDown: tableKeyDown } = useTableKeyboardNav(displayedInvoices.length, {
    onActivate: (index) => {
      const invoice = displayedInvoices[index];
      if (invoice) {
        onRowClick(invoice.id);
      }
    },
    onToggleSelect: onToggleSelect
      ? (index) => {
          const invoice = displayedInvoices[index];
          if (invoice) {
            onToggleSelect(invoice.id);
          }
        }
      : undefined,
  });

  return (
    <Paper sx={{ borderRadius: 3, overflow: "hidden" }} onKeyDown={tableKeyDown}>
      <TableContainer
        ref={showAll ? parentRef : undefined}
        sx={{
          maxHeight: showAll ? VIRTUAL_MAX_HEIGHT : undefined,
          "& .MuiTableHead-root": { bgcolor: alpha(theme.palette.primary.main, UI.ALPHA_HOVER) },
        }}
      >
        <Table stickyHeader={showAll}>
          <InvoicesTableHeader
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={onSort}
            selectionCount={selectedIds?.size}
            totalCount={filteredInvoices.length}
            onToggleSelectAll={onToggleSelectAll}
          />
          <TableBody>
            {showAll ? (
              <VirtualizedRows
                filteredInvoices={filteredInvoices}
                virtualItems={virtualItems}
                totalSize={totalSize}
                selectedIds={selectedIds}
                onToggleSelect={onToggleSelect}
                onRowClick={onRowClick}
                onMenuOpen={onMenuOpen}
                onPrefetch={onPrefetch}
              />
            ) : (
              <PaginatedRows
                invoices={paginatedInvoices}
                selectedIds={selectedIds}
                onToggleSelect={onToggleSelect}
                onRowClick={onRowClick}
                onMenuOpen={onMenuOpen}
                onPrefetch={onPrefetch}
              />
            )}
          </TableBody>
        </Table>
        <InvoicesTableFooter
          showAll={showAll}
          setShowAll={setShowAll}
          filteredCount={filteredInvoices.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </TableContainer>
    </Paper>
  );
}
