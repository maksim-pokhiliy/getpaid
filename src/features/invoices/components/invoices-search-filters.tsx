"use client";

import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { FilterDrawer } from "@app/shared/ui/filter-drawer";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "SENT", label: "Sent" },
  { value: "VIEWED", label: "Viewed" },
  { value: "PARTIALLY_PAID", label: "Partially Paid" },
  { value: "PAID", label: "Paid" },
  { value: "OVERDUE", label: "Overdue" },
] as const;

interface InvoicesSearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  filterDrawerOpen: boolean;
  setFilterDrawerOpen: (open: boolean) => void;
  invoicesCount: number;
  filteredCount: number;
  hasInvoices: boolean;
}

export function InvoicesSearchFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  filterDrawerOpen,
  setFilterDrawerOpen,
  invoicesCount,
  filteredCount,
  hasInvoices,
}: InvoicesSearchFiltersProps) {
  const hasActiveFilters = searchQuery !== "" || statusFilter !== "ALL";

  const handleClearAll = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setFilterDrawerOpen(false);
  };

  const handleMobileStatusChange = (value: string) => {
    setStatusFilter(value);
    setFilterDrawerOpen(false);
  };

  if (!hasInvoices) {
    return null;
  }

  return (
    <>
      <DesktopFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        hasActiveFilters={hasActiveFilters}
        filteredCount={filteredCount}
        invoicesCount={invoicesCount}
      />
      <MobileSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenDrawer={() => setFilterDrawerOpen(true)}
      />
      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        title="Filter Invoices"
      >
        <FormControl size="small" fullWidth>
          <InputLabel id="mobile-status-filter-label">Status</InputLabel>
          <Select
            labelId="mobile-status-filter-label"
            value={statusFilter}
            label="Status"
            onChange={(e) => handleMobileStatusChange(e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {hasActiveFilters && (
          <Button variant="outlined" onClick={handleClearAll}>
            Clear All Filters
          </Button>
        )}
      </FilterDrawer>
    </>
  );
}

interface DesktopFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  hasActiveFilters: boolean;
  filteredCount: number;
  invoicesCount: number;
}

function DesktopFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  hasActiveFilters,
  filteredCount,
  invoicesCount,
}: DesktopFiltersProps) {
  return (
    <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2, mb: 3 }}>
      <TextField
        placeholder="Search invoices..."
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ minWidth: { sm: 280 } }}
        inputProps={{ "aria-label": "Search invoices" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setSearchQuery("")} aria-label="Clear search">
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="status-filter-label">Status</InputLabel>
        <Select
          labelId="status-filter-label"
          value={statusFilter}
          label="Status"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {hasActiveFilters && (
        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center" }}>
          {filteredCount} of {invoicesCount} invoices
        </Typography>
      )}
    </Box>
  );
}

interface MobileSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onOpenDrawer: () => void;
}

function MobileSearch({ searchQuery, setSearchQuery, onOpenDrawer }: MobileSearchProps) {
  return (
    <Box sx={{ display: { xs: "flex", sm: "none" }, mb: 2, gap: 1 }}>
      <TextField
        placeholder="Search invoices..."
        size="small"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        inputProps={{ "aria-label": "Search invoices" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      />
      <IconButton onClick={onOpenDrawer} aria-label="Open filters">
        <FilterListIcon />
      </IconButton>
    </Box>
  );
}
