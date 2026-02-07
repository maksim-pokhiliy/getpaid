"use client";

import { Fab, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";

interface SpeedDialActionItem {
  icon: React.ReactNode;
  name: string;
  onClick: () => void;
}

interface MobileFabProps {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
  actions?: SpeedDialActionItem[];
}

export function MobileFab({ icon, onClick, label, actions }: MobileFabProps) {
  if (actions && actions.length > 0) {
    return (
      <SpeedDial
        ariaLabel={label}
        icon={<SpeedDialIcon />}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          display: { xs: "flex", sm: "none" },
          zIndex: 1050,
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            slotProps={{ tooltip: { title: action.name } }}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    );
  }

  return (
    <Fab
      color="primary"
      aria-label={label}
      onClick={onClick}
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        display: { xs: "flex", sm: "none" },
        zIndex: 1050,
      }}
    >
      {icon}
    </Fab>
  );
}
