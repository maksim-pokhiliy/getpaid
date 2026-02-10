"use client";

import { AppLayout } from "@app/shared/layout/app-layout";
import { Breadcrumbs } from "@app/shared/ui/breadcrumbs";

import { TemplatesPageContent } from "@app/features/templates/components";

export default function TemplatesPage() {
  return (
    <AppLayout>
      <Breadcrumbs items={[{ label: "Templates" }]} />

      <TemplatesPageContent />
    </AppLayout>
  );
}
