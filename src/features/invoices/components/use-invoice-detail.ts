"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@app/shared/ui/toast";
import { useConfirmDialog } from "@app/shared/ui/confirm-dialog";
import { useRecentItems } from "@app/shared/hooks";
import { ApiError } from "@app/shared/api";
import { generateInvoicePdf } from "@app/shared/lib/export";
import type { Invoice } from "@app/shared/schemas/api";
import {
  useSendInvoice,
  useMarkInvoicePaid,
  useDeleteInvoice,
  useDuplicateInvoice,
  useRecordPayment,
  useDeletePayment,
} from "@app/features/invoices";

interface DialogControls {
  closeSendDialog: () => void;
  closeMarkPaidDialog: () => void;
  closePaymentDialog: () => void;
}

function usePaymentHandlers(
  invoiceId: string,
  toast: ReturnType<typeof useToast>,
  confirm: ReturnType<typeof useConfirmDialog>["confirm"],
  controls: Pick<DialogControls, "closeMarkPaidDialog" | "closePaymentDialog">
) {
  const markPaidMutation = useMarkInvoicePaid();
  const recordPaymentMutation = useRecordPayment();
  const deletePaymentMutation = useDeletePayment();

  const handleMarkPaid = () => {
    markPaidMutation.mutate(invoiceId, {
      onSuccess: () => {
        controls.closeMarkPaidDialog();
        toast.success("Invoice marked as paid!", "Payment Recorded");
      },
      onError: (err) => {
        toast.error(err instanceof ApiError ? err.message : "Failed to mark as paid");
      },
    });
  };

  const handleRecordPayment = (amount: string, note: string) => {
    const amountInCents = Math.round(parseFloat(amount) * 100);
    if (isNaN(amountInCents) || amountInCents <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    recordPaymentMutation.mutate(
      { invoiceId, data: { amount: amountInCents, method: "MANUAL", note: note || undefined } },
      {
        onSuccess: () => {
          controls.closePaymentDialog();
          toast.success("Payment recorded successfully!");
        },
        onError: (err) => {
          toast.error(err instanceof ApiError ? err.message : "Failed to record payment");
        },
      }
    );
  };

  const handleDeletePayment = (paymentId: string) => {
    confirm({
      title: "Delete Payment",
      message: "Are you sure you want to delete this payment? This action cannot be undone.",
      confirmText: "Delete",
      confirmColor: "error",
      onConfirm: async () => {
        await deletePaymentMutation.mutateAsync({ invoiceId, paymentId });
        toast.success("Payment deleted");
      },
    });
  };

  return {
    handleMarkPaid,
    handleRecordPayment,
    handleDeletePayment,
    markPaidMutation,
    recordPaymentMutation,
  };
}

function useInvoiceHandlers(
  invoiceId: string,
  invoice: Invoice | undefined,
  controls: DialogControls
) {
  const router = useRouter();
  const toast = useToast();
  const { confirm, dialogProps } = useConfirmDialog();
  const sendMutation = useSendInvoice();
  const deleteMutation = useDeleteInvoice();
  const duplicateMutation = useDuplicateInvoice();

  const paymentHandlers = usePaymentHandlers(invoiceId, toast, confirm, controls);

  const handleSendInvoice = () => {
    sendMutation.mutate(invoiceId, {
      onSuccess: () => {
        controls.closeSendDialog();
        toast.success("Invoice sent successfully!", "Email Sent");
      },
      onError: (err) => {
        toast.error(err instanceof ApiError ? err.message : "Failed to send invoice");
      },
    });
  };

  const copyPublicLink = () => {
    if (!invoice) {
      return;
    }
    const url = `${window.location.origin}/i/${invoice.publicId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleDelete = () => {
    confirm({
      title: "Delete Invoice",
      message: `Are you sure you want to delete invoice #${invoice?.publicId}? This action cannot be undone.`,
      confirmText: "Delete",
      confirmColor: "error",
      onConfirm: async () => {
        await deleteMutation.mutateAsync(invoiceId);
        toast.success("Invoice deleted successfully");
        router.push("/app/invoices");
      },
    });
  };

  const handleDuplicate = () => {
    duplicateMutation.mutate(invoiceId, {
      onSuccess: (newInvoice) => {
        toast.success("Invoice duplicated successfully");
        router.push(`/app/invoices/${newInvoice.id}`);
      },
      onError: (err) => {
        toast.error(err instanceof ApiError ? err.message : "Failed to duplicate invoice");
      },
    });
  };

  const handleDownloadPdf = () => {
    if (!invoice) {
      return;
    }
    generateInvoicePdf({ ...invoice, sender: null });
    toast.success("PDF downloaded!");
  };

  return {
    handleSendInvoice,
    copyPublicLink,
    handleDelete,
    handleDuplicate,
    handleDownloadPdf,
    sendMutation,
    duplicateMutation,
    dialogProps,
    ...paymentHandlers,
  };
}

export function useInvoiceDetail(invoiceId: string, invoice: Invoice | undefined) {
  const { addRecentItem } = useRecentItems();
  const [sendDialogOpen, setSendDialogOpen] = React.useState(false);
  const [markPaidDialogOpen, setMarkPaidDialogOpen] = React.useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = React.useState(false);
  const [auditLogExpanded, setAuditLogExpanded] = React.useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const [paymentsExpanded, setPaymentsExpanded] = React.useState(true);

  React.useEffect(() => {
    if (invoice) {
      addRecentItem({
        id: invoice.id,
        type: "invoice",
        label: `#${invoice.publicId}`,
        href: `/app/invoices/${invoice.id}`,
      });
    }
  }, [invoice, addRecentItem]);

  const handlers = useInvoiceHandlers(invoiceId, invoice, {
    closeSendDialog: () => setSendDialogOpen(false),
    closeMarkPaidDialog: () => setMarkPaidDialogOpen(false),
    closePaymentDialog: () => setPaymentDialogOpen(false),
  });

  return {
    sendDialogOpen,
    setSendDialogOpen,
    markPaidDialogOpen,
    setMarkPaidDialogOpen,
    previewDialogOpen,
    setPreviewDialogOpen,
    auditLogExpanded,
    setAuditLogExpanded,
    paymentDialogOpen,
    setPaymentDialogOpen,
    paymentsExpanded,
    setPaymentsExpanded,
    ...handlers,
  };
}
