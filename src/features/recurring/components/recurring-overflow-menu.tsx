"use client";

import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ReceiptIcon from "@mui/icons-material/Receipt";
import type { RecurringInvoice } from "@app/features/recurring";
import { UI } from "@app/shared/config/config";

interface RecurringOverflowMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  selectedItem: RecurringInvoice | null;
  onEdit: () => void;
  onToggleStatus: () => void;
  onGenerateNow: () => void;
  onDelete: () => void;
}

export function RecurringOverflowMenu({
  anchorEl,
  onClose,
  selectedItem,
  onEdit,
  onToggleStatus,
  onGenerateNow,
  onDelete,
}: RecurringOverflowMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { minWidth: UI.MENU_MIN_WIDTH, borderRadius: 2 },
        },
      }}
    >
      <MenuItem onClick={onEdit}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Edit</ListItemText>
      </MenuItem>
      {selectedItem?.status !== "CANCELED" && (
        <MenuItem onClick={onToggleStatus}>
          <ListItemIcon>
            {selectedItem?.status === "ACTIVE" ? (
              <PauseIcon fontSize="small" />
            ) : (
              <PlayArrowIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>{selectedItem?.status === "ACTIVE" ? "Pause" : "Activate"}</ListItemText>
        </MenuItem>
      )}
      {selectedItem?.status === "ACTIVE" && (
        <MenuItem onClick={onGenerateNow}>
          <ListItemIcon>
            <ReceiptIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Generate Now</ListItemText>
        </MenuItem>
      )}
      <MenuItem onClick={onDelete} sx={{ color: "error.main" }}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  );
}
