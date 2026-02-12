"use client";

import type { Control, FieldArrayWithId } from "react-hook-form";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Divider, Typography } from "@mui/material";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import type { InvoiceFormInput } from "@app/shared/schemas";

import { InvoiceFormGroup } from "./invoice-form-group";
import { SortableItem } from "./sortable-item";

interface InvoiceFormLineItemsProps {
  fields: FieldArrayWithId<InvoiceFormInput, "items", "id">[];
  sensors: SensorDescriptor<SensorOptions>[];
  handleDragEnd: (event: DragEndEvent) => void;
  register: UseFormRegister<InvoiceFormInput>;
  control: Control<InvoiceFormInput>;
  errors: FieldErrors<InvoiceFormInput>;
  currency: string;
  onAppend: () => void;
  onRemove: (index: number) => void;
  onDuplicate: (index: number) => void;
  groupFields: FieldArrayWithId<InvoiceFormInput, "itemGroups", "id">[];
  onRemoveGroup: (index: number) => void;
}

export function InvoiceFormLineItems({
  fields,
  sensors,
  handleDragEnd,
  register,
  control,
  errors,
  currency,
  onAppend,
  onRemove,
  onDuplicate,
  groupFields,
  onRemoveGroup,
}: InvoiceFormLineItemsProps) {
  return (
    <>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        Line Items
      </Typography>

      {groupFields.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {groupFields.map((group, gi) => (
            <InvoiceFormGroup
              key={group.id}
              groupIndex={gi}
              control={control}
              register={register}
              currency={currency}
              onRemoveGroup={() => onRemoveGroup(gi)}
            />
          ))}
        </Box>
      )}

      <Box
        sx={{
          display: { xs: "none", sm: "grid" },
          gridTemplateColumns: "24px 2fr 100px 120px 72px",
          gap: 2,
          mb: 1,
          px: 1,
        }}
      >
        <Box />
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Description
        </Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Quantity
        </Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Unit Price
        </Typography>
        <Box />
      </Box>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          {fields.map((field, index) => (
            <SortableItem
              key={field.id}
              id={field.id}
              index={index}
              currency={currency}
              canDelete={fields.length > 1 || groupFields.length > 0}
              register={register}
              errors={errors}
              onRemove={() => onRemove(index)}
              onDuplicate={() => onDuplicate(index)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="outlined" startIcon={<AddIcon />} onClick={onAppend} sx={{ mb: 4 }}>
        Add Line Item
      </Button>

      <Divider sx={{ my: 4 }} />
    </>
  );
}
