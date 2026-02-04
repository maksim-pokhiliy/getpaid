"use client";

import * as React from "react";
import { QueryProvider } from "./QueryProvider";
import { SessionProvider } from "./SessionProvider";
import { ThemeRegistry } from "@app/components/theme/ThemeRegistry";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeRegistry>{children}</ThemeRegistry>
      </QueryProvider>
    </SessionProvider>
  );
}
