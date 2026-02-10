"use client";

import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import { HelpTooltip } from "@app/shared/ui/help-tooltip";
import { MobileFab } from "@app/shared/ui/mobile-fab";
import { PageHeader } from "@app/shared/ui/page-header";

import { TemplatesContent } from "./templates-content";
import { TemplatesOverflowMenu } from "./templates-overflow-menu";
import { calculateEstimatedTotal } from "./templates-table";
import { useTemplatesPage } from "./use-templates-page";

function TemplatesSearchBar({
  searchQuery,
  setSearchQuery,
  filteredCount,
  totalCount,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredCount: number;
  totalCount: number;
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        placeholder="Search templates..."
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ minWidth: { sm: 280 } }}
        inputProps={{ "aria-label": "Search templates" }}
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
      {searchQuery && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {filteredCount} of {totalCount} templates
        </Typography>
      )}
    </Box>
  );
}

export function TemplatesPageContent() {
  const state = useTemplatesPage();
  const {
    isLoading,
    error,
    sortedTemplates,
    allTemplatesCount,
    searchQuery,
    setSearchQuery,
    menuAnchorEl,
    selectedTemplate,
    sortColumn,
    sortDirection,
    handleMenuOpen,
    handleMenuClose,
    handleDelete,
    handleEdit,
    handleUseTemplate,
    handleSort,
    navigateToNewTemplate,
  } = state;

  return (
    <>
      <PageHeader
        title={
          <>
            Invoice Templates
            <HelpTooltip title="Templates are reusable invoice blueprints with predefined items, tax rates, and due dates. Click 'Use Template' to create a new invoice from any template." />
          </>
        }
        subtitle="Create reusable templates to speed up invoice creation"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={navigateToNewTemplate}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            New Template
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load templates. Please try again.
        </Alert>
      )}

      {!isLoading && allTemplatesCount > 0 && (
        <TemplatesSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredCount={sortedTemplates?.length ?? 0}
          totalCount={allTemplatesCount}
        />
      )}

      <TemplatesContent
        isLoading={isLoading}
        templates={sortedTemplates}
        allTemplatesCount={allTemplatesCount}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery("")}
        onUseTemplate={handleUseTemplate}
        onMenuOpen={handleMenuOpen}
        onCreateTemplate={navigateToNewTemplate}
        calculateEstimatedTotal={calculateEstimatedTotal}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      <TemplatesOverflowMenu
        anchorEl={menuAnchorEl}
        onClose={handleMenuClose}
        selectedTemplate={selectedTemplate}
        onUseTemplate={handleUseTemplate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <MobileFab icon={<AddIcon />} onClick={navigateToNewTemplate} label="New Template" />
    </>
  );
}
