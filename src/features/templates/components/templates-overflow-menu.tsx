"use client";

import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { UI } from "@app/shared/config/config";
import type { Template } from "@app/features/templates";

interface TemplatesOverflowMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  selectedTemplate: Template | undefined;
  onUseTemplate: (template: Template) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TemplatesOverflowMenu({
  anchorEl,
  onClose,
  selectedTemplate,
  onUseTemplate,
  onEdit,
  onDelete,
}: TemplatesOverflowMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      onClick={(e) => e.stopPropagation()}
      slotProps={{
        paper: {
          sx: { minWidth: UI.MENU_MIN_WIDTH, borderRadius: 2 },
        },
      }}
    >
      <MenuItem onClick={() => selectedTemplate && onUseTemplate(selectedTemplate)}>
        <ListItemIcon>
          <ContentCopyIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Use Template</ListItemText>
      </MenuItem>
      <MenuItem onClick={onEdit}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Edit</ListItemText>
      </MenuItem>
      <MenuItem onClick={onDelete} sx={{ color: "error.main" }}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  );
}
