"use client";

import { TableCell, TableRow } from "@mui/material";
import { InvoiceTableRow } from "./table-row";
import type { InvoiceData } from "../invoice-row";

interface VirtualItem {
  index: number;
  start: number;
  end: number;
}

interface VirtualizedRowsProps {
  filteredInvoices: InvoiceData[];
  virtualItems: VirtualItem[];
  totalSize: number;
  onRowClick: (id: string) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, id: string) => void;
  onPrefetch: (id: string) => void;
}

const TABLE_COLUMNS = 7;
const ROW_HEIGHT = 65;

export function VirtualizedRows({
  filteredInvoices,
  virtualItems,
  totalSize,
  onRowClick,
  onMenuOpen,
  onPrefetch,
}: VirtualizedRowsProps) {
  return (
    <>
      {virtualItems.length > 0 && (
        <TableRow style={{ height: virtualItems[0].start }}>
          <TableCell colSpan={TABLE_COLUMNS} sx={{ p: 0, border: 0 }} />
        </TableRow>
      )}
      {virtualItems.map((virtualRow) => {
        const invoice = filteredInvoices[virtualRow.index];
        return (
          <InvoiceTableRow
            key={invoice.id}
            invoice={invoice}
            height={ROW_HEIGHT}
            dataIndex={virtualRow.index}
            onRowClick={onRowClick}
            onMenuOpen={onMenuOpen}
            onPrefetch={onPrefetch}
          />
        );
      })}
      {virtualItems.length > 0 && (
        <TableRow style={{ height: totalSize - (virtualItems[virtualItems.length - 1].end || 0) }}>
          <TableCell colSpan={TABLE_COLUMNS} sx={{ p: 0, border: 0 }} />
        </TableRow>
      )}
    </>
  );
}

interface PaginatedRowsProps {
  invoices: InvoiceData[];
  onRowClick: (id: string) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, id: string) => void;
  onPrefetch: (id: string) => void;
}

export function PaginatedRows({
  invoices,
  onRowClick,
  onMenuOpen,
  onPrefetch,
}: PaginatedRowsProps) {
  return (
    <>
      {invoices.map((invoice) => (
        <InvoiceTableRow
          key={invoice.id}
          invoice={invoice}
          onRowClick={onRowClick}
          onMenuOpen={onMenuOpen}
          onPrefetch={onPrefetch}
        />
      ))}
    </>
  );
}
