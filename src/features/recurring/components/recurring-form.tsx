"use client";

import { useCallback } from "react";
import { Box, Button } from "@mui/material";
import { PageHeader } from "@app/shared/ui/page-header";
import { Spinner } from "@app/shared/ui/loading";
import { LoadingButton } from "@app/shared/ui/loading-button";
import { useRecurringForm } from "./use-recurring-form";
import { RecurringFormSchedule } from "./recurring-form-schedule";
import { RecurringFormItems } from "./recurring-form-items";
import { RecurringFormDiscounts } from "./recurring-form-discounts";

export function RecurringForm() {
  const {
    register,
    handleSubmit,
    control,
    errors,
    fields,
    append,
    remove,
    currency,
    discountType,
    subtotal,
    isPending,
    clients,
    clientsLoading,
    onSubmit,
    router,
  } = useRecurringForm();

  const handleAppend = useCallback(
    () => append({ description: "", quantity: 1, unitPrice: 0 }),
    [append]
  );

  if (clientsLoading) {
    return <Spinner />;
  }

  return (
    <>
      <PageHeader title="New Recurring Invoice" subtitle="Set up automatic invoice generation" />

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <RecurringFormSchedule
          register={register}
          errors={errors}
          clients={clients}
          control={control}
        />

        <RecurringFormItems
          fields={fields}
          register={register}
          errors={errors}
          currency={currency}
          subtotal={subtotal}
          onAppend={handleAppend}
          onRemove={remove}
        />

        <RecurringFormDiscounts
          register={register}
          discountType={discountType}
          currency={currency}
        />

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={() => router.back()}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isPending}>
            Create Schedule
          </LoadingButton>
        </Box>
      </Box>
    </>
  );
}
