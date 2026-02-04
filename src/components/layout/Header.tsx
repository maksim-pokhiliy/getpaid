"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import { Logo } from "@app/components/brand/Logo";
import { useThemeMode } from "@app/components/theme/ThemeRegistry";

const navItems = [
  { label: "Invoices", href: "/app/invoices", icon: <ReceiptLongIcon fontSize="small" /> },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    handleMenuClose();
    await signOut({ callbackUrl: "/auth/sign-in" });
  };

  const handleSettings = () => {
    handleMenuClose();
    router.push("/app/settings");
  };

  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        pt: 2,
        px: 3,
        pb: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: "lg",
          mx: "auto",
          bgcolor: alpha(theme.palette.background.paper, 0.85),
          backdropFilter: "blur(12px)",
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          px: 3,
          height: 80,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Box
          component={Link}
          href="/app"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            mr: 4,
          }}
        >
          <Logo size="medium" />
        </Box>

        {/* Navigation */}
        <Box sx={{ display: "flex", gap: 0.5, flex: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                size="small"
                startIcon={item.icon}
                sx={{
                  color: isActive ? "primary.main" : "text.secondary",
                  bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : "transparent",
                  fontWeight: isActive ? 600 : 500,
                  px: 1.5,
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: isActive
                      ? alpha(theme.palette.primary.main, 0.12)
                      : alpha(theme.palette.text.primary, 0.04),
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* New Invoice Button */}
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon fontSize="small" />}
            onClick={() => router.push("/app/invoices/new")}
            sx={{
              mr: 1,
              display: { xs: "none", sm: "flex" },
            }}
          >
            New Invoice
          </Button>

          {/* Theme Toggle */}
          <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
            <IconButton size="small" onClick={toggleTheme} sx={{ color: "text.secondary" }}>
              {mode === "dark" ? (
                <Brightness7Icon fontSize="small" />
              ) : (
                <Brightness4Icon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Tooltip title="Account">
            <IconButton size="small" onClick={handleMenuOpen} sx={{ color: "text.secondary" }}>
              <AccountCircleIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: {
                  minWidth: 180,
                  mt: 1,
                  borderRadius: 2,
                },
              },
            }}
          >
            <MenuItem onClick={handleSettings}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Sign Out</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
}
