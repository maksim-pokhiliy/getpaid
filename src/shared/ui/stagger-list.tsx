"use client";

import * as React from "react";
import { Fade } from "@mui/material";
import { ANIMATION } from "@app/shared/config/config";

interface StaggerListProps {
  children: React.ReactNode;
  staggerDelay?: number;
}

export function StaggerList({ children, staggerDelay = ANIMATION.STAGGER }: StaggerListProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return child;
        }
        return (
          <Fade
            in={mounted}
            timeout={ANIMATION.NORMAL}
            style={{ transitionDelay: mounted ? `${index * staggerDelay}ms` : "0ms" }}
          >
            {child}
          </Fade>
        );
      })}
    </>
  );
}
