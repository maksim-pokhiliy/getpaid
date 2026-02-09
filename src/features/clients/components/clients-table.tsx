"use client";

import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
  Paper,
  alpha,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatDateCompact } from "@app/shared/lib/format";
import { PAGINATION, UI } from "@app/shared/config/config";

const CLIENT_COLUMNS = [
  { id: "name", label: "Name", hideOnMobile: false },
  { id: "email", label: "Email", hideOnMobile: true },
  { id: "createdAt", label: "Created", hideOnMobile: true },
];

interface Client {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface ClientsTableProps {
  filteredClients: Client[];
  handleMenuOpen: (event: React.MouseEvent<HTMLElement>, clientId: string) => void;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function ClientRow({
  client,
  onMenuOpen,
}: {
  client: Client;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, clientId: string) => void;
}) {
  const theme = useTheme();

  return (
    <TableRow
      hover
      sx={{
        "&:hover": { bgcolor: alpha(theme.palette.primary.main, UI.ALPHA_HOVER) },
      }}
    >
      <TableCell>
        <Typography variant="body2" fontWeight={600}>
          {client.name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: { xs: "block", md: "none" } }}
        >
          {client.email}
        </Typography>
      </TableCell>
      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
        <Typography variant="body2" color="text.secondary">
          {client.email}
        </Typography>
      </TableCell>
      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
        <Typography variant="body2" color="text.secondary">
          {formatDateCompact(client.createdAt)}
        </Typography>
      </TableCell>
      <TableCell>
        <Tooltip title="Actions">
          <IconButton
            size="small"
            onClick={(e) => onMenuOpen(e, client.id)}
            sx={{ color: "text.secondary" }}
            aria-label={`Actions for ${client.name}`}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

export function ClientsTable({
  filteredClients,
  handleMenuOpen,
  sortColumn,
  sortDirection,
  onSort,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: ClientsTableProps) {
  const theme = useTheme();
  const paginatedClients = filteredClients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        "& .MuiTableHead-root": {
          bgcolor: alpha(theme.palette.primary.main, UI.ALPHA_HOVER),
        },
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {CLIENT_COLUMNS.map((col) => (
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
        <TableBody>
          {paginatedClients.map((client) => (
            <ClientRow key={client.id} client={client} onMenuOpen={handleMenuOpen} />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filteredClients.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[...PAGINATION.PAGE_SIZE_OPTIONS]}
      />
    </TableContainer>
  );
}
