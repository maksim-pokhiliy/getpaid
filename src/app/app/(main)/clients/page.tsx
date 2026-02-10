"use client";

import { AppLayout } from "@app/shared/layout/app-layout";
import { Breadcrumbs } from "@app/shared/ui/breadcrumbs";

import { ClientsPageContent } from "@app/features/clients/components";

export default function ClientsPage() {
  return (
    <AppLayout>
      <Breadcrumbs items={[{ label: "Clients" }]} />
      <ClientsPageContent />
    </AppLayout>
  );
}
