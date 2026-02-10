"use client";

import { useCallback } from "react";

import SaveIcon from "@mui/icons-material/Save";
import { Box, Button } from "@mui/material";

import type { TemplateFormData } from "@app/shared/schemas";
import { LoadingButton } from "@app/shared/ui/loading-button";
import { PageHeader } from "@app/shared/ui/page-header";

import { TemplateFormDetails } from "./template-form-details";
import { TemplateFormItems } from "./template-form-items";
import { useTemplateForm } from "./use-template-form";

interface TemplateFormProps {
  mode?: "create" | "edit";
  templateId?: string;
  initialData?: TemplateFormData;
}

export function TemplateForm({ mode = "create", templateId, initialData }: TemplateFormProps) {
  const {
    register,
    handleSubmit,
    errors,
    fields,
    append,
    remove,
    currency,
    discountType,
    isPending,
    isEdit,
    onSubmit,
    router,
  } = useTemplateForm({ mode, templateId, initialData });

  const handleAppend = useCallback(
    () => append({ description: "", quantity: 1, unitPrice: 0 }),
    [append]
  );

  return (
    <>
      <PageHeader
        title={isEdit ? "Edit Template" : "Create Template"}
        subtitle={
          isEdit ? "Update your invoice template" : "Create a reusable template for common invoices"
        }
      />

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TemplateFormDetails
          register={register}
          errors={errors}
          currency={currency}
          discountType={discountType}
        />

        <TemplateFormItems
          fields={fields}
          register={register}
          errors={errors}
          currency={currency}
          onAppend={handleAppend}
          onRemove={remove}
        />

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={() => router.push("/app/templates")}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            loading={isPending}
          >
            {isEdit ? "Save Changes" : "Create Template"}
          </LoadingButton>
        </Box>
      </Box>
    </>
  );
}
