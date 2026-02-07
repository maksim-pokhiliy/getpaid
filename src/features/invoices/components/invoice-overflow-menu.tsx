"use client";

import * as React from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PreviewIcon from "@mui/icons-material/Preview";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { UI } from "@app/shared/config/config";

interface InvoiceOverflowMenuProps {
  isDraft: boolean;
  isPaid: boolean;
  isPartiallyPaid: boolean;
  isDuplicating: boolean;
  isDeleting?: boolean;
  onPreview: () => void;
  onMarkPaid: () => void;
  onDownloadPdf: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function InvoiceOverflowMenu({
  isDraft,
  isPaid,
  isPartiallyPaid,
  isDuplicating,
  isDeleting,
  onPreview,
  onMarkPaid,
  onDownloadPdf,
  onDuplicate,
  onDelete,
}: InvoiceOverflowMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isPending = isDuplicating || isDeleting;

  const handleClick = (action: () => void) => {
    setAnchorEl(null);
    action();
  };

  return (
    <>
      <Tooltip title="More actions">
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: UI.MENU_MIN_WIDTH, borderRadius: 2 } } }}
      >
        {isDraft && (
          <MenuItem
            onClick={() => handleClick(onPreview)}
            disabled={isPending}
            sx={{ display: { sm: "none" } }}
          >
            <ListItemIcon>
              <PreviewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Preview</ListItemText>
          </MenuItem>
        )}
        {!isPaid && !isPartiallyPaid && (
          <MenuItem
            onClick={() => handleClick(onMarkPaid)}
            disabled={isPending}
            sx={{ display: { md: "none" } }}
          >
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark Paid</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => handleClick(onDownloadPdf)} disabled={isPending}>
          <ListItemIcon>
            <PictureAsPdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleClick(onDuplicate)} disabled={isPending}>
          <ListItemIcon>
            {isDuplicating ? <CircularProgress size={18} /> : <ContentCopyIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleClick(onDelete)}
          disabled={isPending}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            {isDeleting ? (
              <CircularProgress size={18} />
            ) : (
              <DeleteIcon fontSize="small" color="error" />
            )}
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
