"use client";

import {
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Typography,
} from "@mui/material";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { SenderProfileFormInput } from "@app/shared/schemas";
import { CURRENCIES } from "@app/features/invoices/constants/invoice";

interface CurrencySelectorProps {
  register: UseFormRegister<SenderProfileFormInput>;
  errors: FieldErrors<SenderProfileFormInput>;
  currentValue: string;
}

export function CurrencySelector({ register, errors, currentValue }: CurrencySelectorProps) {
  return (
    <>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        Invoice Defaults
      </Typography>
      <Box sx={{ maxWidth: 300 }}>
        <FormControl fullWidth error={!!errors.defaultCurrency}>
          <InputLabel id="currency-label">Default Currency</InputLabel>
          <Select
            {...register("defaultCurrency")}
            labelId="currency-label"
            label="Default Currency"
            value={currentValue || "USD"}
          >
            {CURRENCIES.map((c) => (
              <MenuItem key={c.value} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </Select>
          {errors.defaultCurrency && (
            <FormHelperText>{errors.defaultCurrency.message}</FormHelperText>
          )}
        </FormControl>
      </Box>
    </>
  );
}
