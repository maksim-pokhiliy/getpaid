"use client";

import { Box, TextField, Typography, Divider } from "@mui/material";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { SenderProfileFormInput } from "@app/shared/schemas";

interface CompanyInfoFieldsProps {
  register: UseFormRegister<SenderProfileFormInput>;
  errors: FieldErrors<SenderProfileFormInput>;
}

export function CompanyInfoFields({ register, errors }: CompanyInfoFieldsProps) {
  return (
    <>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        Company Information
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          mb: 4,
        }}
      >
        <TextField
          {...register("companyName")}
          label="Company Name"
          fullWidth
          error={!!errors.companyName}
          helperText={errors.companyName?.message || "Your business or company name"}
        />
        <TextField
          {...register("displayName")}
          label="Display Name"
          fullWidth
          error={!!errors.displayName}
          helperText={errors.displayName?.message || "Your personal name (if not using company)"}
        />
      </Box>

      <Divider sx={{ my: 4 }} />
    </>
  );
}
