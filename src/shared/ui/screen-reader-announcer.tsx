"use client";

import * as React from "react";

import { Box } from "@mui/material";

interface AnnounceContextValue {
  announce: (message: string) => void;
}

const AnnounceContext = React.createContext<AnnounceContextValue | null>(null);

export function useAnnounce() {
  const context = React.useContext(AnnounceContext);

  if (!context) {
    throw new Error("useAnnounce must be used within ScreenReaderProvider");
  }

  return context.announce;
}

export function ScreenReaderProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = React.useState("");

  const announce = React.useCallback((text: string) => {
    setMessage("");
    requestAnimationFrame(() => {
      setMessage(text);
    });
  }, []);

  const value = React.useMemo(() => ({ announce }), [announce]);

  return (
    <AnnounceContext.Provider value={value}>
      {children}
      <Box
        aria-live="polite"
        aria-atomic="true"
        role="status"
        sx={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          clipPath: "inset(50%)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {message}
      </Box>
    </AnnounceContext.Provider>
  );
}
