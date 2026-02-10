"use client";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { IconButton, Tooltip } from "@mui/material";

interface HelpTooltipProps {
  title: string;
}

export function HelpTooltip({ title }: HelpTooltipProps) {
  return (
    <Tooltip title={title} arrow>
      <IconButton size="small" sx={{ ml: 0.5, color: "text.secondary" }} aria-label={title}>
        <HelpOutlineIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Tooltip>
  );
}
