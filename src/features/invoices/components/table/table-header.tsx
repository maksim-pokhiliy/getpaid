"use client";

import { Box, TableCell, TableHead, TableRow, alpha, useTheme } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface TableHeaderProps {
  sortColumn: string;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
}

const COLUMNS = [
  { id: "publicId", label: "Invoice #" },
  { id: "client", label: "Client" },
  { id: "total", label: "Amount" },
  { id: "dueDate", label: "Due Date" },
  { id: "status", label: "Status" },
  { id: "createdAt", label: "Created" },
];

export function InvoicesTableHeader({ sortColumn, sortDirection, onSort }: TableHeaderProps) {
  const theme = useTheme();

  const sortableHeaderSx = {
    fontWeight: 600,
    cursor: "pointer",
    userSelect: "none",
    "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.08) },
  };

  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return null;
    }
    return sortDirection === "asc" ? (
      <ArrowUpwardIcon sx={{ fontSize: 16 }} />
    ) : (
      <ArrowDownwardIcon sx={{ fontSize: 16 }} />
    );
  };

  return (
    <TableHead>
      <TableRow>
        {COLUMNS.map((col) => (
          <TableCell key={col.id} sx={sortableHeaderSx} onClick={() => onSort(col.id)}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {col.label} {renderSortIcon(col.id)}
            </Box>
          </TableCell>
        ))}
        <TableCell sx={{ fontWeight: 600, width: 48 }} />
      </TableRow>
    </TableHead>
  );
}
