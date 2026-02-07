"use client";

import { useTheme } from "@mui/material";

export function NoResultsIllustration() {
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
      <circle cx="72" cy="52" r="28" fill={light} />
      <circle cx="72" cy="52" r="22" fill="none" stroke={primary} strokeWidth="3" opacity="0.4" />
      <circle cx="72" cy="52" r="14" fill={primary} opacity="0.08" />
      <line
        x1="90"
        y1="70"
        x2="110"
        y2="90"
        stroke={primary}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.4"
      />
      <rect
        x="106"
        y="86"
        width="12"
        height="6"
        rx="3"
        transform="rotate(-45 106 86)"
        fill={primary}
        opacity="0.3"
      />
      <line
        x1="64"
        y1="48"
        x2="80"
        y2="48"
        stroke={primary}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      <line
        x1="64"
        y1="54"
        x2="76"
        y2="54"
        stroke={primary}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.2"
      />
      <rect
        x="30"
        y="100"
        width="100"
        height="3"
        rx="1.5"
        fill={theme.palette.text.secondary}
        opacity="0.15"
      />
      <rect
        x="50"
        y="107"
        width="60"
        height="3"
        rx="1.5"
        fill={theme.palette.text.secondary}
        opacity="0.1"
      />
    </svg>
  );
}
