"use client";

import {
  alpha,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";

import { isNavActive, NAV_ITEMS } from "./desktop-nav";

interface DrawerNavListProps {
  pathname: string;
  onNavigate: (href: string) => void;
}

export function DrawerNavList({ pathname, onNavigate }: DrawerNavListProps) {
  const theme = useTheme();

  return (
    <List sx={{ px: 1 }}>
      {NAV_ITEMS.map((item) => {
        const isActive = isNavActive(pathname, item);

        return (
          <ListItem key={item.href} disablePadding>
            <ListItemButton
              onClick={() => onNavigate(item.href)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : "transparent",
              }}
            >
              <ListItemIcon sx={{ color: isActive ? "primary.main" : "text.secondary" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 500,
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
