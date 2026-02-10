"use client";

import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";

import { UI } from "@app/shared/config/config";

interface AccountMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSettings: () => void;
  onSignOut: () => void;
}

export function AccountMenu({ anchorEl, onClose, onSettings, onSignOut }: AccountMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        paper: {
          sx: { minWidth: UI.MENU_MIN_WIDTH, mt: 1, borderRadius: 2 },
        },
      }}
    >
      <MenuItem onClick={onSettings}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Settings</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={onSignOut}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Sign Out</ListItemText>
      </MenuItem>
    </Menu>
  );
}
