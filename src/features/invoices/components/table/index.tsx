"use client";

import * as React from "react";
import { Paper, Table, TableBody, TableContainer, alpha, useTheme } from "@mui/material";
import { InvoicesTableHeader } from "./table-header";
import { InvoicesTableFooter } from "./table-footer";
import { VirtualizedRows, PaginatedRows } from "./table-rows";
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
}: InvoicesTableProps) {
  const theme = useTheme();

  return (
    <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
      <TableContainer
        ref={showAll ? parentRef : undefined}
        sx={{
          maxHeight: showAll ? VIRTUAL_MAX_HEIGHT : undefined,
          "& .MuiTableHead-root": { bgcolor: alpha(theme.palette.primary.main, 0.04) },
        }}
      >
        <Table stickyHeader={showAll}>
          <InvoicesTableHeader
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={onSort}
          />
          <TableBody>
            {showAll ? (
              <VirtualizedRows
                filteredInvoices={filteredInvoices}
                virtualItems={virtualItems}
                totalSize={totalSize}
                onRowClick={onRowClick}
                onMenuOpen={onMenuOpen}
                onPrefetch={onPrefetch}
              />
            ) : (
              <PaginatedRows
                invoices={paginatedInvoices}
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
