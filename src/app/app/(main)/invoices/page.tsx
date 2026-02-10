"use client";

import { AppLayout } from "@app/shared/layout/app-layout";
import { Breadcrumbs } from "@app/shared/ui/breadcrumbs";

import { InvoicesPageContent } from "@app/features/invoices/components";

export default function InvoicesPage() {
  return (
    <AppLayout>
      <Breadcrumbs items={[{ label: "Invoices" }]} />

      <InvoicesPageContent />
    </AppLayout>
  );
}
