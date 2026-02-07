"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Logo } from "@app/shared/ui/logo";
import { useThemeMode } from "@app/providers/theme-registry";
import { UI } from "@app/shared/config/config";
import { NAV_ITEMS, isNavActive } from "./components/desktop-nav";

function SidebarNav({ pathname }: { pathname: string }) {
  const theme = useTheme();

  return (
    <List sx={{ px: 1, flex: 1 }}>
      {NAV_ITEMS.map((item) => {
        const isActive = isNavActive(pathname, item);
        return (
          <ListItem key={item.href} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : "transparent",
                "&:hover": {
                  bgcolor: isActive
                    ? alpha(theme.palette.primary.main, 0.12)
                    : alpha(theme.palette.text.primary, 0.04),
                },
              }}
            >
              <ListItemIcon
                sx={{ minWidth: 36, color: isActive ? "primary.main" : "text.secondary" }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.9375rem",
                  color: isActive ? "primary.main" : "text.primary",
                }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

function SidebarFooter({ pathname }: { pathname: string }) {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Box sx={{ mt: "auto" }}>
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            href="/app/settings"
            sx={{
              borderRadius: 2,
              mb: 0.5,
              bgcolor: pathname.startsWith("/app/settings")
                ? alpha(theme.palette.primary.main, 0.08)
                : "transparent",
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: "0.9375rem" }} />
          </ListItemButton>
        </ListItem>
      </List>

      <Box
        sx={{
          px: 2,
          pb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
          <IconButton size="small" onClick={toggleTheme} sx={{ color: "text.secondary" }}>
            {mode === "dark" ? (
              <Brightness7Icon fontSize="small" />
            ) : (
              <Brightness4Icon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        <Typography variant="caption" color="text.secondary">
          {mode === "dark" ? "Dark" : "Light"}
        </Typography>

        <Tooltip title="Sign out">
          <IconButton
            size="small"
            onClick={() => signOut({ callbackUrl: "/auth/sign-in" })}
            sx={{ color: "text.secondary" }}
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();

  return (
    <Box
      component="nav"
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        width: UI.SIDEBAR_WIDTH,
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        zIndex: theme.zIndex.drawer,
      }}
    >
      <Box
        component={Link}
        href="/app"
        sx={{ display: "flex", alignItems: "center", px: 2.5, py: 2.5, textDecoration: "none" }}
      >
        <Logo size="medium" />
      </Box>

      <Box sx={{ px: 2, mb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => router.push("/app/invoices/new")}
          sx={{ py: 1.25 }}
        >
          New Invoice
        </Button>
      </Box>

      <SidebarNav pathname={pathname} />
      <SidebarFooter pathname={pathname} />
    </Box>
  );
}
