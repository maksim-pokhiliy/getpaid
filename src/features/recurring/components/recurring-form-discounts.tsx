"use client";

import type { UseFormRegister } from "react-hook-form";

import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import type { RecurringFormData } from "@app/shared/schemas";

interface RecurringFormDiscountsProps {
  register: UseFormRegister<RecurringFormData>;
  discountType: string;
  currency: string;
}

export function RecurringFormDiscounts({
  register,
  discountType,
  currency,
}: RecurringFormDiscountsProps) {
  return (
    <>
      <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3 }}>
          Discounts & Taxes
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 3,
          }}
        >
          <FormControl fullWidth>
            <InputLabel>Discount Type</InputLabel>
            <Select {...register("discountType")} label="Discount Type" defaultValue="NONE">
              <MenuItem value="NONE">No Discount</MenuItem>
              <MenuItem value="PERCENTAGE">Percentage</MenuItem>
              <MenuItem value="FIXED">Fixed Amount</MenuItem>
            </Select>
          </FormControl>

          {discountType !== "NONE" && (
            <TextField
              {...register("discountValue", { valueAsNumber: true })}
              label={discountType === "PERCENTAGE" ? "Discount %" : "Discount Amount"}
              type="number"
              slotProps={{
                htmlInput: { min: 0, step: discountType === "PERCENTAGE" ? 1 : 0.01 },
                input: {
                  endAdornment:
                    discountType === "PERCENTAGE" ? (
                      <InputAdornment position="end">%</InputAdornment>
                    ) : (
                      <InputAdornment position="start">{currency}</InputAdornment>
                    ),
                },
              }}
            />
          )}

          <TextField
            {...register("taxRate", { valueAsNumber: true })}
            label="Tax Rate"
            type="number"
            slotProps={{
              htmlInput: { min: 0, max: 100, step: 0.1 },
              input: { endAdornment: <InputAdornment position="end">%</InputAdornment> },
            }}
          />
        </Box>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3 }}>
          Notes
        </Typography>

        <TextField
          {...register("notes")}
          label="Notes (Optional)"
          multiline
          rows={3}
          fullWidth
          placeholder="Additional notes that will appear on every invoice"
        />
      </Paper>
    </>
  );
}
