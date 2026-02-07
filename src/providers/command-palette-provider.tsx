"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import RepeatIcon from "@mui/icons-material/Repeat";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import { CommandPaletteContext, type CommandItem } from "@app/shared/hooks/use-command-palette";
import { CommandPalette } from "@app/shared/ui/command-palette";
import { useRecentItems, type RecentItem } from "@app/shared/hooks/use-recent-items";
import { SHORTCUTS } from "@app/shared/config/config";

function recentToCommandItem(item: RecentItem, router: ReturnType<typeof useRouter>): CommandItem {
  return {
    id: `recent-${item.id}`,
    label: `${item.type}: ${item.label}`,
    group: "Recent",
    action: () => router.push(item.href),
  };
}

function buildNavItems(router: ReturnType<typeof useRouter>): CommandItem[] {
  return [
    {
      id: "nav-dashboard",
      label: "Dashboard",
      icon: <DashboardIcon fontSize="small" />,
      shortcut: SHORTCUTS.GO_DASHBOARD.keys,
      group: "Navigation",
      action: () => router.push("/app"),
    },
    {
      id: "nav-invoices",
      label: "Invoices",
      icon: <ReceiptLongIcon fontSize="small" />,
      shortcut: SHORTCUTS.GO_INVOICES.keys,
      group: "Navigation",
      action: () => router.push("/app/invoices"),
    },
    {
      id: "nav-clients",
      label: "Clients",
      icon: <PeopleIcon fontSize="small" />,
      shortcut: SHORTCUTS.GO_CLIENTS.keys,
      group: "Navigation",
      action: () => router.push("/app/clients"),
    },
    {
      id: "nav-templates",
      label: "Templates",
      icon: <DescriptionIcon fontSize="small" />,
      shortcut: SHORTCUTS.GO_TEMPLATES.keys,
      group: "Navigation",
      action: () => router.push("/app/templates"),
    },
    {
      id: "nav-recurring",
      label: "Recurring",
      icon: <RepeatIcon fontSize="small" />,
      shortcut: SHORTCUTS.GO_RECURRING.keys,
      group: "Navigation",
      action: () => router.push("/app/recurring"),
    },
    {
      id: "nav-settings",
      label: "Settings",
      icon: <SettingsIcon fontSize="small" />,
      shortcut: SHORTCUTS.GO_SETTINGS.keys,
      group: "Navigation",
      action: () => router.push("/app/settings"),
    },
  ];
}

function buildActionItems(router: ReturnType<typeof useRouter>): CommandItem[] {
  return [
    {
      id: "action-new-invoice",
      label: "New Invoice",
      icon: <AddIcon fontSize="small" />,
      shortcut: SHORTCUTS.NEW_INVOICE.keys,
      group: "Actions",
      action: () => router.push("/app/invoices/new"),
    },
    {
      id: "action-new-client",
      label: "New Client",
      icon: <AddIcon fontSize="small" />,
      group: "Actions",
      action: () => router.push("/app/clients"),
    },
    {
      id: "action-new-template",
      label: "New Template",
      icon: <AddIcon fontSize="small" />,
      group: "Actions",
      action: () => router.push("/app/templates/new"),
    },
    {
      id: "action-new-recurring",
      label: "New Recurring Invoice",
      icon: <AddIcon fontSize="small" />,
      group: "Actions",
      action: () => router.push("/app/recurring/new"),
    },
  ];
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { recentItems } = useRecentItems();
  const [isOpen, setIsOpen] = React.useState(false);
  const [dynamicItems, setDynamicItems] = React.useState<CommandItem[]>([]);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);

  const registerItems = React.useCallback((newItems: CommandItem[]) => {
    setDynamicItems((prev) => [
      ...prev.filter((p) => !newItems.some((n) => n.id === p.id)),
      ...newItems,
    ]);
  }, []);

  const unregisterItems = React.useCallback((ids: string[]) => {
    setDynamicItems((prev) => prev.filter((p) => !ids.includes(p.id)));
  }, []);

  const items = React.useMemo<CommandItem[]>(() => {
    const recentCommandItems = recentItems.map((item) => recentToCommandItem(item, router));
    return [
      ...buildNavItems(router),
      ...buildActionItems(router),
      ...recentCommandItems,
      ...dynamicItems,
    ];
  }, [router, recentItems, dynamicItems]);

  const value = React.useMemo(
    () => ({ isOpen, open, close, items, registerItems, unregisterItems }),
    [isOpen, open, close, items, registerItems, unregisterItems]
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      <CommandPalette />
    </CommandPaletteContext.Provider>
  );
}
