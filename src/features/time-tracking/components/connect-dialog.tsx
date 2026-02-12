"use client";

import * as React from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  TextField,
  Typography,
} from "@mui/material";

import { PROVIDER_META } from "../constants";
import { useConnectProvider } from "../hooks";

interface ConnectDialogProps {
  open: boolean;
  onClose: () => void;
  providerId: string;
}

export function ConnectDialog({ open, onClose, providerId }: ConnectDialogProps) {
  const [token, setToken] = React.useState("");
  const mutation = useConnectProvider();
  const meta = PROVIDER_META[providerId];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutation.mutate(
      { provider: providerId, token: token.trim() },
      {
        onSuccess: () => {
          setToken("");
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    if (mutation.isPending) {
      return;
    }

    setToken("");
    mutation.reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Connect {meta?.name ?? providerId}</DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your API token to connect. You can find it in your{" "}
            <Link href={meta?.docsUrl} target="_blank" rel="noopener">
              profile settings
            </Link>
            .
          </Typography>

          {mutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {mutation.error?.message ?? "Failed to connect"}
            </Alert>
          )}

          <TextField
            autoFocus
            fullWidth
            label="API Token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={mutation.isPending}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={!token.trim() || mutation.isPending}>
            {mutation.isPending ? "Connecting..." : "Connect"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
