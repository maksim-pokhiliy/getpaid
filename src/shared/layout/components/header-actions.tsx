"use client";

import { useRouter } from "next/navigation";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Box, Button, IconButton, Tooltip } from "@mui/material";

interface HeaderActionsProps {
  mode: "light" | "dark";
  onToggleTheme: () => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

export function HeaderActions({ mode, onToggleTheme, onMenuOpen }: HeaderActionsProps) {
  const router = useRouter();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Button
        variant="contained"
        size="small"
        startIcon={<AddIcon fontSize="small" />}
        onClick={() => router.push("/app/invoices/new")}
        sx={{ mr: 1, display: { xs: "none", sm: "flex" } }}
      >
        New Invoice
      </Button>

      <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
        <IconButton size="small" onClick={onToggleTheme} sx={{ color: "text.secondary" }}>
          {mode === "dark" ? (
            <Brightness7Icon fontSize="small" />
          ) : (
            <Brightness4Icon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>

      <Tooltip title="Account">
        <IconButton size="small" onClick={onMenuOpen} sx={{ color: "text.secondary" }}>
          <AccountCircleIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
