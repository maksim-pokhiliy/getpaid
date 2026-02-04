"use client";

import * as React from "react";
import { QueryProvider } from "./QueryProvider";
import { SessionProvider } from "./SessionProvider";
import { ThemeRegistry } from "@app/components/theme/ThemeRegistry";
import { ToastProvider } from "@app/components/feedback/Toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeRegistry>
          <ToastProvider>{children}</ToastProvider>
        </ThemeRegistry>
      </QueryProvider>
    </SessionProvider>
  );
}
