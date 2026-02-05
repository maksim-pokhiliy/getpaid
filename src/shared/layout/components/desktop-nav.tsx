"use client";

import Link from "next/link";
import { Box, Button, alpha, useTheme } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import RepeatIcon from "@mui/icons-material/Repeat";

const NAV_ITEMS = [
  { label: "Invoices", href: "/app/invoices", icon: <ReceiptLongIcon fontSize="small" /> },
  { label: "Recurring", href: "/app/recurring", icon: <RepeatIcon fontSize="small" /> },
  { label: "Clients", href: "/app/clients", icon: <PeopleIcon fontSize="small" /> },
  { label: "Templates", href: "/app/templates", icon: <DescriptionIcon fontSize="small" /> },
];

interface DesktopNavProps {
  pathname: string;
}

export function DesktopNav({ pathname }: DesktopNavProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, flex: 1 }}>
      {NAV_ITEMS.map((item) => {
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
  );
}

export { NAV_ITEMS };
