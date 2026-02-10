"use client";

import * as React from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Alert,
  AlertTitle,
  Button,
  IconButton,
  keyframes,
  LinearProgress,
  Slide,
  SlideProps,
  Snackbar,
} from "@mui/material";

import { UI } from "@app/shared/config/config";

type ToastSeverity = "success" | "error" | "warning" | "info";

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface Toast {
  id: string;
  message: string;
  title?: string;
  severity: ToastSeverity;
  duration?: number;
  action?: ToastAction;
}

interface ToastContextValue {
  showToast: (
    message: string,
    severity?: ToastSeverity,
    title?: string,
    duration?: number,
    action?: ToastAction
  ) => void;
  success: (message: string, title?: string, action?: ToastAction) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const countdown = keyframes`
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
`;

const icons = {
  success: <CheckCircleIcon />,
  error: <ErrorIcon />,
  warning: <WarningIcon />,
  info: <InfoIcon />,
};

function ToastItem({
  toast,
  index,
  onHide,
}: {
  toast: Toast;
  index: number;
  onHide: (id: string) => void;
}) {
  return (
    <Snackbar
      open
      autoHideDuration={toast.duration}
      onClose={() => onHide(toast.id)}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{ bottom: { xs: 16 + index * 80, sm: 24 + index * 80 } }}
    >
      <Alert
        severity={toast.severity}
        icon={icons[toast.severity]}
        action={
          <>
            {toast.action && (
              <Button
                size="small"
                color="inherit"
                sx={{ fontWeight: 600, mr: 0.5 }}
                onClick={() => {
                  toast.action?.onClick();
                  onHide(toast.id);
                }}
              >
                {toast.action.label}
              </Button>
            )}
            <IconButton size="small" color="inherit" onClick={() => onHide(toast.id)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
        sx={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          minWidth: UI.TOAST_MIN_WIDTH,
          boxShadow: 2,
          "& .MuiAlert-icon": { alignItems: "center" },
        }}
      >
        {toast.title && <AlertTitle sx={{ fontWeight: 600 }}>{toast.title}</AlertTitle>}
        {toast.message}
        <LinearProgress
          variant="determinate"
          value={100}
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            bgcolor: "transparent",
            "& .MuiLinearProgress-bar": {
              transformOrigin: "left",
              animation: `${countdown} ${toast.duration || UI.TOAST_DURATION_DEFAULT}ms linear forwards`,
            },
          }}
        />
      </Alert>
    </Snackbar>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback(
    (
      message: string,
      severity: ToastSeverity = "info",
      title?: string,
      duration: number = UI.TOAST_DURATION_DEFAULT,
      action?: ToastAction
    ) => {
      const id = Math.random().toString(36).substring(2, 9);

      setToasts((prev) => {
        const next = [...prev, { id, message, severity, title, duration, action }];

        if (next.length > UI.MAX_VISIBLE_TOASTS) {
          return next.slice(next.length - UI.MAX_VISIBLE_TOASTS);
        }

        return next;
      });
    },
    []
  );

  const hideToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = React.useMemo(
    () => ({
      showToast,
      success: (message: string, title?: string, action?: ToastAction) =>
        showToast(message, "success", title, action ? UI.TOAST_DURATION_LONG : undefined, action),
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
        <ToastItem key={toast.id} toast={toast} index={index} onHide={hideToast} />
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
