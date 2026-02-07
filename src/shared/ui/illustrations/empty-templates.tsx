"use client";

import { useTheme } from "@mui/material";

export function EmptyTemplatesIllustration() {
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
      <rect x="25" y="15" width="80" height="95" rx="6" fill={light} />
      <rect
        x="30"
        y="20"
        width="70"
        height="85"
        rx="4"
        fill={theme.palette.background.paper}
        stroke={primary}
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />
      <rect x="55" y="25" width="80" height="95" rx="6" fill={light} />
      <rect
        x="60"
        y="30"
        width="70"
        height="85"
        rx="4"
        fill={theme.palette.background.paper}
        stroke={primary}
        strokeWidth="2"
      />
      <rect x="72" y="44" width="35" height="4" rx="2" fill={primary} opacity="0.5" />
      <rect
        x="72"
        y="54"
        width="46"
        height="3"
        rx="1.5"
        fill={theme.palette.text.secondary}
        opacity="0.3"
      />
      <rect
        x="72"
        y="62"
        width="40"
        height="3"
        rx="1.5"
        fill={theme.palette.text.secondary}
        opacity="0.3"
      />
      <rect
        x="72"
        y="70"
        width="30"
        height="3"
        rx="1.5"
        fill={theme.palette.text.secondary}
        opacity="0.3"
      />
      <line x1="72" y1="82" x2="118" y2="82" stroke={primary} strokeWidth="1" opacity="0.3" />
      <rect x="98" y="88" width="20" height="5" rx="2.5" fill={primary} opacity="0.7" />
    </svg>
  );
}
