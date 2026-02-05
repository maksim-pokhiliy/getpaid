"use client";

import * as React from "react";
import Link from "next/link";
import { Breadcrumbs as MuiBreadcrumbs, Typography, Link as MuiLink, Box } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export function Breadcrumbs({ items, showHome = true }: BreadcrumbsProps) {
  const allItems = showHome
    ? [{ label: "Home", href: "/app", icon: <HomeIcon sx={{ fontSize: 18 }} /> }, ...items]
    : items;

  return (
    <MuiBreadcrumbs
      separator={<NavigateNextIcon sx={{ fontSize: 18, color: "text.secondary" }} />}
      sx={{ mb: 2 }}
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;

        if (isLast) {
          return (
            <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {item.icon}
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                {item.label}
              </Typography>
            </Box>
          );
        }

        return (
          <MuiLink
            key={item.label}
            component={Link}
            href={item.href || "#"}
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
              textDecoration: "none",
              "&:hover": {
                color: "primary.main",
                textDecoration: "none",
              },
            }}
          >
            {item.icon}
            {item.label}
          </MuiLink>
        );
      })}
    </MuiBreadcrumbs>
  );
}
