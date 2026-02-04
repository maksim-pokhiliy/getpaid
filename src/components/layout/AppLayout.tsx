"use client";

import * as React from "react";
import { Box, Container } from "@mui/material";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface AppLayoutProps {
  children: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  disablePadding?: boolean;
}

// Header height (80px) + top padding (16px) + bottom padding (16px) = 112px = 14 spacing units
const HEADER_HEIGHT = 14;

export function AppLayout({ children, maxWidth = "lg", disablePadding = false }: AppLayoutProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
        pt: HEADER_HEIGHT,
      }}
    >
      <Header />
      <Box component="main" sx={{ flex: 1, py: disablePadding ? 0 : 4, px: 3 }}>
        {maxWidth ? (
          <Container maxWidth={maxWidth} disableGutters>
            {children}
          </Container>
        ) : (
          children
        )}
      </Box>
      <Footer />
    </Box>
  );
}
