"use client";

import * as React from "react";
import { Fade, Box } from "@mui/material";
import { UI } from "@app/shared/config/config";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Fade in={mounted} timeout={UI.PAGE_TRANSITION_DURATION}>
      <Box>{children}</Box>
    </Fade>
  );
}
