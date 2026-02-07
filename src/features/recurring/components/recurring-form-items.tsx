"use client";

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  IconButton,
  Divider,
  alpha,
  useTheme,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import type { FieldErrors, UseFormRegister, FieldArrayWithId } from "react-hook-form";
import type { RecurringFormData } from "@app/shared/schemas";

interface RecurringFormItemsProps {
  fields: FieldArrayWithId<RecurringFormData, "items", "id">[];
  register: UseFormRegister<RecurringFormData>;
  errors: FieldErrors<RecurringFormData>;
  currency: string;
  subtotal: number;
  onAppend: () => void;
  onRemove: (index: number) => void;
}

export function RecurringFormItems({
  fields,
  register,
  errors,
  currency,
  subtotal,
  onAppend,
  onRemove,
}: RecurringFormItemsProps) {
  const theme = useTheme();

  return (
    <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3 }}>
        Line Items
      </Typography>

      {fields.map((field, index) => (
        <Box
          key={field.id}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr auto" },
            gap: 2,
            mb: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.default, 0.5),
          }}
        >
          <TextField
            {...register(`items.${index}.description`)}
            label="Description"
            size="small"
            error={!!errors.items?.[index]?.description}
            helperText={errors.items?.[index]?.description?.message}
          />
          <TextField
            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
            label="Quantity"
            type="number"
            size="small"
            slotProps={{ htmlInput: { min: 1 } }}
          />
          <TextField
            {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
            label="Unit Price"
            type="number"
            size="small"
            slotProps={{
              htmlInput: { min: 0, step: 0.01 },
              input: {
                startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
              },
            }}
          />
          <Tooltip title="Remove item">
            <span>
              <IconButton
                onClick={() => onRemove(index)}
                disabled={fields.length === 1}
                sx={{ alignSelf: "center" }}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ))}

      <Button variant="outlined" startIcon={<AddIcon />} onClick={onAppend}>
        Add Item
      </Button>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Typography variant="body1">
          Subtotal:{" "}
          <strong>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency,
            }).format(subtotal)}
          </strong>
        </Typography>
      </Box>
    </Paper>
  );
}
