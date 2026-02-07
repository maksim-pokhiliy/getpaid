"use client";

import { useSearchParams } from "next/navigation";
import { AppLayout } from "@app/shared/layout/app-layout";
import { Breadcrumbs } from "@app/shared/ui/breadcrumbs";
import { InvoiceForm } from "@app/features/invoices/components";
import { useClients, useCreateClient } from "@app/features/clients";
import { useTemplate } from "@app/features/templates";

export default function NewInvoicePage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId") || undefined;

  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: template, isLoading: templateLoading } = useTemplate(templateId ?? "");
  const createClientMutation = useCreateClient();

  return (
    <AppLayout>
      <Breadcrumbs
        items={[{ label: "Invoices", href: "/app/invoices" }, { label: "New Invoice" }]}
      />
      <InvoiceForm
        mode="create"
        templateId={templateId}
        clients={clients}
        clientsLoading={clientsLoading}
        template={template}
        templateLoading={templateLoading}
        createClientMutation={createClientMutation}
      />
    </AppLayout>
  );
}
