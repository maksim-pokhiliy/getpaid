"use client";

import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ToastProvider } from "@app/shared/ui/toast";
import { ScreenReaderProvider } from "@app/shared/ui/screen-reader-announcer";
import { CommandPaletteProvider } from "./command-palette-provider";
import { ThemeRegistry } from "./theme-registry";
import { QueryProvider } from "./query-provider";
import { SessionProvider } from "./session-provider";

export { ThemeRegistry, useThemeMode } from "./theme-registry";
export { QueryProvider } from "./query-provider";
export { SessionProvider } from "./session-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeRegistry>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ScreenReaderProvider>
              <ToastProvider>
                <CommandPaletteProvider>{children}</CommandPaletteProvider>
              </ToastProvider>
            </ScreenReaderProvider>
          </LocalizationProvider>
        </ThemeRegistry>
      </QueryProvider>
    </SessionProvider>
  );
}
