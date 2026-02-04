"use client";

import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { QueryProvider } from "./QueryProvider";
import { SessionProvider } from "./SessionProvider";
import { ThemeRegistry } from "@app/components/theme/ThemeRegistry";
import { ToastProvider } from "@app/components/feedback/Toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeRegistry>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ToastProvider>{children}</ToastProvider>
          </LocalizationProvider>
        </ThemeRegistry>
      </QueryProvider>
    </SessionProvider>
  );
}
