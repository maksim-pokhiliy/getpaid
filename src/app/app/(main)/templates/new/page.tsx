"use client";

import { AppLayout } from "@app/shared/layout/app-layout";
import { Breadcrumbs } from "@app/shared/ui/breadcrumbs";
import { TemplateForm } from "@app/features/templates/components";

export default function NewTemplatePage() {
  return (
    <AppLayout>
      <Breadcrumbs
        items={[{ label: "Templates", href: "/app/templates" }, { label: "New Template" }]}
      />
      <TemplateForm />
    </AppLayout>
  );
}
