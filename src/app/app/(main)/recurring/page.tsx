"use client";

import { AppLayout } from "@app/shared/layout/app-layout";
import { Breadcrumbs } from "@app/shared/ui/breadcrumbs";

import { RecurringPageContent } from "@app/features/recurring/components";

export default function RecurringInvoicesPage() {
  return (
    <AppLayout>
      <Breadcrumbs items={[{ label: "Recurring Invoices" }]} />

      <RecurringPageContent />
    </AppLayout>
  );
}
