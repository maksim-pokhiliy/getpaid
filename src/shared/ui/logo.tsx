"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
}

export function Logo({ size = "medium", showText = true }: LogoProps) {
  const sizes = {
    small: { icon: 24, text: "1.125rem", gap: 0.75 },
    medium: { icon: 28, text: "1.375rem", gap: 1 },
    large: { icon: 32, text: "1.75rem", gap: 1.25 },
  };

  const { icon: iconSize, text: textSize, gap } = sizes[size];

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap }}>
      <Box
        sx={{
          width: iconSize,
          height: iconSize,
          borderRadius: 1.5,
          bgcolor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontSize: iconSize * 0.55,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.05em",
          }}
        >
          in
        </Typography>
      </Box>

      {showText && (
        <Typography
          sx={{
            fontSize: textSize,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: "text.primary",
          }}
        >
          Invox
        </Typography>
      )}
    </Box>
  );
}
