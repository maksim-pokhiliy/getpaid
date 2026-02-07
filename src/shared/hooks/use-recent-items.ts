"use client";

import * as React from "react";
import { STORAGE_KEYS } from "@app/shared/config/config";

const STORAGE_KEY = STORAGE_KEYS.RECENT_ITEMS;
const MAX_ITEMS = 10;

export interface RecentItem {
  id: string;
  type: "invoice" | "client" | "template" | "recurring";
  label: string;
  href: string;
  timestamp: number;
}

function loadItems(): RecentItem[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn("[recent-items] Failed to load from localStorage:", error);
    return [];
  }
}

function saveItems(items: RecentItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn("[recent-items] Failed to save to localStorage:", error);
  }
}

export function useRecentItems() {
  const [items, setItems] = React.useState<RecentItem[]>(loadItems);

  const addRecentItem = React.useCallback((item: Omit<RecentItem, "timestamp">) => {
    setItems((prev) => {
      const filtered = prev.filter((existing) => existing.id !== item.id);
      const next = [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, MAX_ITEMS);
      saveItems(next);
      return next;
    });
  }, []);

  const getRecentItems = React.useCallback(() => items, [items]);

  return { recentItems: items, addRecentItem, getRecentItems };
}
