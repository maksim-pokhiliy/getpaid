"use client";

import { useTheme } from "@mui/material";

export function EmptyInvoicesIllustration() {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const light = theme.palette.action.hover;

  return (
    <svg
      width="160"
      height="120"
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="30" y="10" width="100" height="100" rx="8" fill={light} />
      <rect
        x="38"
        y="18"
        width="84"
        height="84"
        rx="4"
        fill={theme.palette.background.paper}
        stroke={primary}
        strokeWidth="2"
      />
      <rect x="50" y="32" width="40" height="4" rx="2" fill={primary} opacity="0.6" />
      <rect
        x="50"
        y="42"
        width="60"
        height="3"
        rx="1.5"
        fill={theme.palette.text.secondary}
        opacity="0.3"
      />
      <rect
        x="50"
        y="50"
        width="55"
        height="3"
        rx="1.5"
        fill={theme.palette.text.secondary}
        opacity="0.3"
      />
      <rect
        x="50"
        y="58"
        width="48"
        height="3"
        rx="1.5"
        fill={theme.palette.text.secondary}
        opacity="0.3"
      />
      <line x1="50" y1="70" x2="110" y2="70" stroke={primary} strokeWidth="1" opacity="0.3" />
      <rect x="80" y="76" width="30" height="6" rx="3" fill={primary} opacity="0.8" />
      <rect
        x="50"
        y="77"
        width="20"
        height="4"
        rx="2"
        fill={theme.palette.text.secondary}
        opacity="0.2"
      />
    </svg>
  );
}
