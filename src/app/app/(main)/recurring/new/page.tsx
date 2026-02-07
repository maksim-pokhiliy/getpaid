"use client";

import { AppLayout } from "@app/shared/layout/app-layout";
import { Breadcrumbs } from "@app/shared/ui/breadcrumbs";
import { RecurringForm } from "@app/features/recurring/components";

export default function NewRecurringPage() {
  return (
    <AppLayout>
      <Breadcrumbs
        items={[{ label: "Recurring Invoices", href: "/app/recurring" }, { label: "New" }]}
      />
      <RecurringForm />
    </AppLayout>
  );
}
