"use client";

import * as React from "react";
import { Snackbar, Alert, AlertTitle, Slide, SlideProps, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import { UI } from "@app/shared/config/config";

type ToastSeverity = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  title?: string;
  severity: ToastSeverity;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, severity?: ToastSeverity, title?: string, duration?: number) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const icons = {
  success: <CheckCircleIcon />,
  error: <ErrorIcon />,
  warning: <WarningIcon />,
  info: <InfoIcon />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback(
    (
      message: string,
      severity: ToastSeverity = "info",
      title?: string,
      duration: number = UI.TOAST_DURATION_DEFAULT
    ) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, severity, title, duration }]);
    },
    []
  );

  const hideToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = React.useMemo(
    () => ({
      showToast,
      success: (message: string, title?: string) => showToast(message, "success", title),
      error: (message: string, title?: string) => showToast(message, "error", title),
      warning: (message: string, title?: string) => showToast(message, "warning", title),
      info: (message: string, title?: string) => showToast(message, "info", title),
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open
          autoHideDuration={toast.duration}
          onClose={() => hideToast(toast.id)}
          TransitionComponent={SlideTransition}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{
            bottom: { xs: 16 + index * 80, sm: 24 + index * 80 },
          }}
        >
          <Alert
            severity={toast.severity}
            icon={icons[toast.severity]}
            action={
              <IconButton size="small" color="inherit" onClick={() => hideToast(toast.id)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            sx={{
              width: "100%",
              minWidth: UI.TOAST_MIN_WIDTH,
              boxShadow: 3,
              "& .MuiAlert-icon": {
                alignItems: "center",
              },
            }}
          >
            {toast.title && <AlertTitle sx={{ fontWeight: 600 }}>{toast.title}</AlertTitle>}
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
