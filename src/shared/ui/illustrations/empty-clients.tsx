"use client";

import { useTheme } from "@mui/material";

export function EmptyClientsIllustration() {
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
      <circle cx="80" cy="45" r="20" fill={light} />
      <circle cx="80" cy="40" r="12" fill={primary} opacity="0.2" />
      <circle cx="80" cy="36" r="8" fill={primary} opacity="0.4" />
      <path
        d="M56 80C56 66.7452 66.7452 56 80 56C93.2548 56 104 66.7452 104 80V85H56V80Z"
        fill={primary}
        opacity="0.15"
      />
      <circle cx="50" cy="50" r="8" fill={primary} opacity="0.1" />
      <circle cx="50" cy="48" r="5" fill={primary} opacity="0.2" />
      <circle cx="110" cy="50" r="8" fill={primary} opacity="0.1" />
      <circle cx="110" cy="48" r="5" fill={primary} opacity="0.2" />
      <rect
        x="40"
        y="95"
        width="80"
        height="3"
        rx="1.5"
        fill={theme.palette.text.secondary}
        opacity="0.2"
      />
      <rect
        x="55"
        y="102"
        width="50"
        height="3"
        rx="1.5"
        fill={theme.palette.text.secondary}
        opacity="0.15"
      />
    </svg>
  );
}
