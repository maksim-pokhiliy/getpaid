"use client";

import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RepeatIcon from "@mui/icons-material/Repeat";
import AddIcon from "@mui/icons-material/Add";
import { EmptyState, NoResults } from "@app/shared/ui/empty-state";
import { EmptyRecurringIllustration } from "@app/shared/ui/illustrations/empty-recurring";
import { TableSkeleton } from "@app/shared/ui/loading";
import { formatCurrency, formatDateCompact } from "@app/shared/lib/format";
import { PAGINATION } from "@app/shared/config/config";
import type { RecurringInvoice } from "@app/features/recurring";
import { RECURRING_FREQUENCY_LABELS, RECURRING_STATUS_CONFIG } from "../constants";

interface RecurringContentProps {
  isLoading: boolean;
  recurring: RecurringInvoice[] | undefined;
  filteredRecurring: RecurringInvoice[];
  searchQuery: string;
  onClearSearch: () => void;
  onRowClick: (id: string) => void;
  handleMenuOpen: (event: React.MouseEvent<HTMLElement>, item: RecurringInvoice) => void;
  calculateTotal: (item: RecurringInvoice) => number;
  onCreateRecurring: () => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function RecurringRow({
  item,
  onRowClick,
  onMenuOpen,
  calculateTotal,
}: {
  item: RecurringInvoice;
  onRowClick: (id: string) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, item: RecurringInvoice) => void;
  calculateTotal: (item: RecurringInvoice) => number;
}) {
  const theme = useTheme();

  return (
    <TableRow
      hover
      sx={{ "&:last-child td": { border: 0 }, cursor: "pointer" }}
      onClick={() => onRowClick(item.id)}
    >
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RepeatIcon sx={{ fontSize: 18, color: "primary.main" }} />
          </Box>
          <Box>
            <Typography fontWeight={500}>{item.name}</Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {item.client.name}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
        <Typography variant="body2">{item.client.name}</Typography>
        <Typography variant="caption" color="text.secondary">
          {item.client.email}
        </Typography>
      </TableCell>
      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
        {RECURRING_FREQUENCY_LABELS[item.frequency]}
      </TableCell>
      <TableCell sx={{ fontWeight: 500 }}>
        {formatCurrency(calculateTotal(item), item.currency)}
      </TableCell>
      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
        {formatDateCompact(item.nextRunAt)}
      </TableCell>
      <TableCell>
        <Chip
          label={RECURRING_STATUS_CONFIG[item.status].label}
          color={RECURRING_STATUS_CONFIG[item.status].color}
          size="small"
        />
      </TableCell>
      <TableCell align="right">
        <Tooltip title="Actions">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onMenuOpen(e, item);
            }}
            aria-label={`Actions for ${item.name}`}
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

export function RecurringContent({
  isLoading,
  recurring,
  filteredRecurring,
  searchQuery,
  onClearSearch,
  onRowClick,
  handleMenuOpen,
  calculateTotal,
  onCreateRecurring,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: RecurringContentProps) {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <TableSkeleton rows={5} columns={7} />
      </Paper>
    );
  }

  if (recurring && recurring.length > 0 && filteredRecurring.length === 0 && searchQuery) {
    return <NoResults entity="recurring invoices" onClear={onClearSearch} />;
  }

  if (filteredRecurring && filteredRecurring.length > 0) {
    const paginatedRecurring = filteredRecurring.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    return (
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, display: { xs: "none", md: "table-cell" } }}>
                Client
              </TableCell>
              <TableCell sx={{ fontWeight: 600, display: { xs: "none", md: "table-cell" } }}>
                Frequency
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, display: { xs: "none", md: "table-cell" } }}>
                Next Run
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRecurring.map((item) => (
              <RecurringRow
                key={item.id}
                item={item}
                onRowClick={onRowClick}
                onMenuOpen={handleMenuOpen}
                calculateTotal={calculateTotal}
              />
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredRecurring.length}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[...PAGINATION.PAGE_SIZE_OPTIONS]}
        />
      </TableContainer>
    );
  }

  return (
    <EmptyState
      icon={<RepeatIcon sx={{ fontSize: 40, color: "primary.main" }} />}
      illustration={<EmptyRecurringIllustration />}
      title="No recurring invoices yet"
      description="Set up automatic invoice generation for regular clients"
      action={
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={onCreateRecurring}
        >
          Create Recurring Invoice
        </Button>
      }
    />
  );
}
