"use client";

import type { Control, UseFormRegister } from "react-hook-form";
import { useFieldArray } from "react-hook-form";

import DeleteIcon from "@mui/icons-material/Delete";
import {
  alpha,
  Box,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import type { InvoiceFormInput } from "@app/shared/schemas";

interface InvoiceFormGroupProps {
  groupIndex: number;
  control: Control<InvoiceFormInput>;
  register: UseFormRegister<InvoiceFormInput>;
  currency: string;
  onRemoveGroup: () => void;
}

export function InvoiceFormGroup({
  groupIndex,
  control,
  register,
  currency,
  onRemoveGroup,
}: InvoiceFormGroupProps) {
  const theme = useTheme();
  const { fields, remove } = useFieldArray({ control, name: `itemGroups.${groupIndex}.items` });

  return (
    <Box
      sx={{
        mb: 2,
        borderRadius: 2,
        border: 1,
        borderColor: alpha(theme.palette.primary.main, 0.2),
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          px: 2,
          py: 1,
          bgcolor: alpha(theme.palette.primary.main, 0.06),
          gap: 1,
        }}
      >
        <TextField
          {...register(`itemGroups.${groupIndex}.title`)}
          variant="standard"
          size="small"
          placeholder="Group title"
          InputProps={{ disableUnderline: true, sx: { fontWeight: 600, fontSize: "0.875rem" } }}
          sx={{ flex: 1 }}
        />
        <Tooltip title="Remove group">
          <IconButton size="small" color="error" onClick={onRemoveGroup}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {fields.map((field, itemIndex) => (
        <Stack
          key={field.id}
          direction="row"
          alignItems="start"
          sx={{
            px: 2,
            py: 1,
            gap: 1.5,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <TextField
            {...register(`itemGroups.${groupIndex}.items.${itemIndex}.title`)}
            placeholder="Title"
            size="small"
            sx={{ flex: 1, minWidth: 120 }}
          />
          <TextField
            {...register(`itemGroups.${groupIndex}.items.${itemIndex}.description`)}
            placeholder="Description"
            size="small"
            sx={{ flex: 2 }}
          />
          <TextField
            {...register(`itemGroups.${groupIndex}.items.${itemIndex}.quantity`, {
              valueAsNumber: true,
            })}
            type="number"
            placeholder="Qty"
            size="small"
            inputProps={{ min: 0.01, step: 0.01 }}
            sx={{ width: 90 }}
          />
          <TextField
            {...register(`itemGroups.${groupIndex}.items.${itemIndex}.unitPrice`, {
              valueAsNumber: true,
            })}
            type="number"
            placeholder="Rate"
            size="small"
            inputProps={{ min: 0, step: 0.01 }}
            InputProps={{
              startAdornment: (
                <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
                  {currency}
                </Typography>
              ),
            }}
            sx={{ width: 130 }}
          />
          <Tooltip title="Remove item">
            <span>
              <IconButton
                size="small"
                color="error"
                onClick={() => remove(itemIndex)}
                disabled={fields.length <= 1}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      ))}
    </Box>
  );
}
