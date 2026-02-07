"use client";

import {
  Checkbox,
  Chip,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatCurrency, formatDateCompact } from "@app/shared/lib/format";
import { STATUS_CONFIG } from "../../constants/invoice";
import type { InvoiceData } from "../invoice-row";

interface InvoiceTableRowProps {
  invoice: InvoiceData;
  height?: number;
  dataIndex?: number;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  onRowClick: (id: string) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, id: string) => void;
  onPrefetch: (id: string) => void;
}

export function InvoiceTableRow({
  invoice,
  height,
  dataIndex,
  selected,
  onToggleSelect,
  onRowClick,
  onMenuOpen,
  onPrefetch,
}: InvoiceTableRowProps) {
  const theme = useTheme();
  const status = STATUS_CONFIG[invoice.status] || STATUS_CONFIG.DRAFT;

  return (
    <TableRow
      data-index={dataIndex}
      hover
      selected={selected}
      sx={{
        cursor: "pointer",
        transition: "background-color 0.2s",
        height,
        "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.04) },
      }}
      onMouseEnter={() => onPrefetch(invoice.id)}
      onClick={() => onRowClick(invoice.id)}
    >
      {onToggleSelect && (
        <TableCell padding="checkbox">
          <Checkbox
            checked={!!selected}
            onClick={(e) => e.stopPropagation()}
            onChange={() => onToggleSelect(invoice.id)}
            size="small"
          />
        </TableCell>
      )}
      <TableCell>
        <Typography variant="body2" fontWeight={600} color="primary.main">
          {invoice.publicId}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" fontWeight={500}>
          {invoice.client.name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: { xs: "none", md: "block" } }}
        >
          {invoice.client.email}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" fontWeight={600}>
          {formatCurrency(invoice.total, invoice.currency)}
        </Typography>
      </TableCell>
      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
        <Typography variant="body2" color="text.secondary">
          {formatDateCompact(invoice.dueDate)}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip label={status.label} size="small" color={status.color} sx={{ fontWeight: 500 }} />
      </TableCell>
      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
        <Typography variant="body2" color="text.secondary">
          {formatDateCompact(invoice.createdAt)}
        </Typography>
      </TableCell>
      <TableCell>
        <Tooltip title="Actions">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onMenuOpen(e, invoice.id);
            }}
            sx={{ color: "text.secondary" }}
            aria-label={`Actions for invoice ${invoice.publicId}`}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
