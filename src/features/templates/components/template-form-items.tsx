"use client";

import type { FieldArrayWithId, FieldErrors, UseFormRegister } from "react-hook-form";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import type { TemplateFormData } from "@app/shared/schemas";

interface LineItemRowProps {
  index: number;
  register: UseFormRegister<TemplateFormData>;
  errors: FieldErrors<TemplateFormData>;
  currency: string;
  canRemove: boolean;
  onRemove: () => void;
}

function LineItemRow({ index, register, errors, currency, canRemove, onRemove }: LineItemRowProps) {
  const itemErrors = errors.items?.[index];

  return (
    <Grid container spacing={2} alignItems="flex-start">
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          label="Description"
          fullWidth
          {...register(`items.${index}.description`)}
          error={!!itemErrors?.description}
          helperText={itemErrors?.description?.message}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 2 }}>
        <TextField
          label="Quantity"
          type="number"
          fullWidth
          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
          error={!!itemErrors?.quantity}
          helperText={itemErrors?.quantity?.message}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <TextField
          label="Unit Price"
          type="number"
          fullWidth
          {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
          error={!!itemErrors?.unitPrice}
          helperText={itemErrors?.unitPrice?.message}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
            },
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 1 }} sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
        <IconButton onClick={onRemove} disabled={!canRemove} color="error" aria-label="Remove item">
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}

interface TemplateFormItemsProps {
  fields: FieldArrayWithId<TemplateFormData, "items", "id">[];
  register: UseFormRegister<TemplateFormData>;
  errors: FieldErrors<TemplateFormData>;
  currency: string;
  onAppend: () => void;
  onRemove: (index: number) => void;
}

export function TemplateFormItems({
  fields,
  register,
  errors,
  currency,
  onAppend,
  onRemove,
}: TemplateFormItemsProps) {
  return (
    <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Line Items
        </Typography>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={onAppend}>
          Add Item
        </Button>
      </Box>

      {errors.items?.root && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {errors.items.root.message}
        </Typography>
      )}

      {fields.map((field, index) => (
        <Box key={field.id}>
          {index > 0 && <Divider sx={{ my: 2 }} />}
          <LineItemRow
            index={index}
            register={register}
            errors={errors}
            currency={currency}
            canRemove={fields.length > 1}
            onRemove={() => onRemove(index)}
          />
        </Box>
      ))}
    </Paper>
  );
}
