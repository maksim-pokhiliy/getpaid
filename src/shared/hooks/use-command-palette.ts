"use client";

import * as React from "react";

export interface CommandItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: readonly string[];
  group: "Navigation" | "Actions" | "Recent";
  action: () => void;
}

interface CommandPaletteContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  items: CommandItem[];
  registerItems: (items: CommandItem[]) => void;
  unregisterItems: (ids: string[]) => void;
}

export const CommandPaletteContext = React.createContext<CommandPaletteContextValue | null>(null);

export function useCommandPalette() {
  const context = React.useContext(CommandPaletteContext);

  if (!context) {
    throw new Error("useCommandPalette must be used within CommandPaletteProvider");
  }

  return context;
}
