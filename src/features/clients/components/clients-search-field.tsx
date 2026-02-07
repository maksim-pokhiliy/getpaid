"use client";

import { Box, Typography, IconButton, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface ClientsSearchFieldProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredCount: number;
  totalCount: number;
}

export function ClientsSearchField({
  searchQuery,
  onSearchChange,
  filteredCount,
  totalCount,
}: ClientsSearchFieldProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        placeholder="Search clients..."
        size="small"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: { sm: 280 } }}
        inputProps={{ "aria-label": "Search clients" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => onSearchChange("")} aria-label="Clear search">
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {searchQuery && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {filteredCount} of {totalCount} clients
        </Typography>
      )}
    </Box>
  );
}
