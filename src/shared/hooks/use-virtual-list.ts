import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface UseVirtualListOptions<T> {
  items: T[];
  estimateSize?: number;
  overscan?: number;
}

export function useVirtualList<T>({
  items,
  estimateSize = 60,
  overscan = 5,
}: UseVirtualListOptions<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Virtual API is stable, safe to use here
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  return {
    parentRef,
    virtualizer,
    virtualItems,
    totalSize,
    items,
  };
}
