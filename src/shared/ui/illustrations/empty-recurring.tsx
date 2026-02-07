"use client";

import { useTheme } from "@mui/material";

export function EmptyRecurringIllustration() {
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
      <rect x="30" y="20" width="100" height="80" rx="8" fill={light} />
      <rect
        x="38"
        y="28"
        width="84"
        height="64"
        rx="4"
        fill={theme.palette.background.paper}
        stroke={primary}
        strokeWidth="1.5"
      />
      <rect x="38" y="28" width="84" height="16" rx="4" fill={primary} opacity="0.1" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect
          key={i}
          x={46 + i * 11}
          y="32"
          width="8"
          height="8"
          rx="2"
          fill={primary}
          opacity={i === 3 ? 0.6 : 0.15}
        />
      ))}
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3, 4, 5, 6].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={46 + col * 11}
            y={50 + row * 12}
            width="8"
            height="8"
            rx="2"
            fill={primary}
            opacity={row === 0 && col === 2 ? 0.5 : 0.08}
          />
        ))
      )}
      <path
        d="M80 100 C80 100, 70 95, 70 90 C70 85, 80 80, 80 80 C80 80, 90 85, 90 90 C90 95, 80 100, 80 100"
        fill="none"
        stroke={primary}
        strokeWidth="2"
        opacity="0.4"
      />
      <path
        d="M78 90 L86 90"
        stroke={primary}
        strokeWidth="1.5"
        opacity="0.4"
        markerEnd="url(#arrow)"
      />
    </svg>
  );
}
