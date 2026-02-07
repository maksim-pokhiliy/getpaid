"use client";

import { AppLayout } from "@app/shared/layout/app-layout";
import { DashboardContent } from "@app/features/dashboard/components";

export default function DashboardPage() {
  return (
    <AppLayout>
      <DashboardContent />
    </AppLayout>
  );
}
