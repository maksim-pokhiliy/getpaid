"use client";

import * as React from "react";

interface UseTableKeyboardNavOptions {
  onActivate?: (index: number) => void;
  onToggleSelect?: (index: number) => void;
}

export function useTableKeyboardNav(rowCount: number, options?: UseTableKeyboardNavOptions) {
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (rowCount === 0) {
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) => Math.min(prev + 1, rowCount - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          if (focusedIndex >= 0) {
            e.preventDefault();
            options?.onActivate?.(focusedIndex);
          }

          break;
        case " ":
          if (focusedIndex >= 0 && options?.onToggleSelect) {
            e.preventDefault();
            options.onToggleSelect(focusedIndex);
          }

          break;
        case "Home":
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedIndex(rowCount - 1);
          break;
      }
    },
    [rowCount, focusedIndex, options]
  );

  const getFocusProps = React.useCallback(
    (index: number) => ({
      tabIndex: index === focusedIndex ? 0 : -1,
      "data-focused": index === focusedIndex ? true : undefined,
      sx:
        index === focusedIndex
          ? { outline: "2px solid", outlineColor: "primary.main", outlineOffset: -2 }
          : undefined,
    }),
    [focusedIndex]
  );

  return { focusedIndex, onKeyDown, getFocusProps, setFocusedIndex };
}
