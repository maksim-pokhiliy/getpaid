"use client";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { Box, Typography } from "@mui/material";

interface InvoiceHeaderProps {
  logoUrl: string | null;
  senderName: string;
  primaryColor: string;
  accentColor: string;
}

export function InvoiceHeader({
  logoUrl,
  senderName,
  primaryColor,
  accentColor,
}: InvoiceHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        mb: 4,
        "@media print": { display: "none" },
      }}
    >
      {logoUrl ? (
        <Box
          component="img"
          src={logoUrl}
          alt="Company logo"
          sx={{
            maxWidth: 180,
            maxHeight: 60,
            objectFit: "contain",
          }}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <>
          <ReceiptLongIcon sx={{ color: primaryColor, fontSize: 28 }} />
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {senderName}
          </Typography>
        </>
      )}
    </Box>
  );
}
