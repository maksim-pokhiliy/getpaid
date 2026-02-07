"use client";

import {
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  alpha,
  useTheme,
} from "@mui/material";

interface TableHeaderProps {
  sortColumn: string;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
  selectionCount?: number;
  totalCount?: number;
  onToggleSelectAll?: () => void;
}

const COLUMNS: { id: string; label: string; hideOnMobile?: boolean }[] = [
  { id: "publicId", label: "Invoice #" },
  { id: "client", label: "Client" },
  { id: "total", label: "Amount" },
  { id: "dueDate", label: "Due Date", hideOnMobile: true },
  { id: "status", label: "Status" },
  { id: "createdAt", label: "Created", hideOnMobile: true },
];

export function InvoicesTableHeader({
  sortColumn,
  sortDirection,
  onSort,
  selectionCount = 0,
  totalCount = 0,
  onToggleSelectAll,
}: TableHeaderProps) {
  const theme = useTheme();

  return (
    <TableHead>
      <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
        {onToggleSelectAll && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={selectionCount > 0 && selectionCount < totalCount}
              checked={totalCount > 0 && selectionCount === totalCount}
              onChange={onToggleSelectAll}
              size="small"
            />
          </TableCell>
        )}
        {COLUMNS.map((col) => (
          <TableCell
            key={col.id}
            sortDirection={sortColumn === col.id ? sortDirection : false}
            sx={col.hideOnMobile ? { display: { xs: "none", md: "table-cell" } } : undefined}
          >
            <TableSortLabel
              active={sortColumn === col.id}
              direction={sortColumn === col.id ? sortDirection : "asc"}
              onClick={() => onSort(col.id)}
              sx={{ fontWeight: 600 }}
            >
              {col.label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell sx={{ fontWeight: 600, width: 48 }} />
      </TableRow>
    </TableHead>
  );
}
