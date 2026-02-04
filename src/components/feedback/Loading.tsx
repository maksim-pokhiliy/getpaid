"use client";

import * as React from "react";
import { Box, CircularProgress, Skeleton, Typography, keyframes } from "@mui/material";

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

// Full page loading spinner
export function PageLoader({ message }: { message?: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 2,
      }}
    >
      <CircularProgress size={40} thickness={4} />
      {message && (
        <Typography color="text.secondary" variant="body2">
          {message}
        </Typography>
      )}
    </Box>
  );
}

// Inline spinner
export function Spinner({ size = 24 }: { size?: number }) {
  return <CircularProgress size={size} thickness={4} />;
}

// Dots loading animation
export function DotsLoader() {
  return (
    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "primary.main",
            animation: `${bounce} 1.4s ease-in-out infinite`,
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </Box>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, pb: 2, borderBottom: 1, borderColor: "divider" }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" width={`${100 / columns}%`} height={24} />
        ))}
      </Box>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ display: "flex", gap: 2, py: 1.5 }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" width={`${100 / columns}%`} height={20} />
          ))}
        </Box>
      ))}
    </Box>
  );
}

// Card skeleton
export function CardSkeleton() {
  return (
    <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 3 }}>
      <Skeleton variant="text" width="60%" height={28} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="100%" height={20} />
      <Skeleton variant="text" width="80%" height={20} />
      <Skeleton variant="text" width="40%" height={20} sx={{ mt: 2 }} />
    </Box>
  );
}

// Invoice list item skeleton
export function InvoiceItemSkeleton() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3, py: 2 }}>
      <Skeleton variant="rounded" width={80} height={24} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="text" width="25%" height={16} />
      </Box>
      <Skeleton variant="text" width={80} height={20} />
      <Skeleton variant="text" width={100} height={20} />
      <Skeleton variant="rounded" width={70} height={24} />
    </Box>
  );
}

// Stat card skeleton
export function StatSkeleton() {
  return (
    <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 3 }}>
      <Skeleton variant="text" width="50%" height={16} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="70%" height={36} />
    </Box>
  );
}

// Pulsing text placeholder
export function PulsingText({ width = 100 }: { width?: number | string }) {
  return (
    <Box
      sx={{
        width,
        height: 16,
        borderRadius: 1,
        bgcolor: "action.hover",
        animation: `${pulse} 2s ease-in-out infinite`,
      }}
    />
  );
}
