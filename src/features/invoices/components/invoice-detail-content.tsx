"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  alpha,
  useTheme,
  LinearProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import LinkIcon from "@mui/icons-material/Link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
import AddIcon from "@mui/icons-material/Add";
import { AppLayout } from "@app/shared/layout/app-layout";
import { Breadcrumbs } from "@app/shared/ui/breadcrumbs";
import { PageLoader } from "@app/shared/ui/loading";
import { ConfirmDialog } from "@app/shared/ui/confirm-dialog";
import { useInvoice } from "@app/features/invoices";
import { formatCurrency, formatDate } from "@app/shared/lib/format";
import { STATUS_CONFIG } from "@app/shared/config/invoice-status";
import type { Invoice } from "@app/shared/schemas/api";
import {
  InvoiceTimeline,
  PaymentHistory,
  ActivityHistory,
  SendDialog,
  MarkPaidDialog,
  RecordPaymentDialog,
  InvoicePreviewDialog,
  InvoiceOverflowMenu,
} from "@app/features/invoices/components";
import { useInvoiceDetail } from "./use-invoice-detail";

type InvoiceDetailReturn = ReturnType<typeof useInvoiceDetail>;

interface DetailActionsProps {
  isDraft: boolean;
  isPaid: boolean;
  isPartiallyPaid: boolean;
  invoiceId: string;
  detail: InvoiceDetailReturn;
}

function DetailActions({
  isDraft,
  isPaid,
  isPartiallyPaid,
  invoiceId,
  detail,
}: DetailActionsProps) {
  const router = useRouter();

  return (
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
      {isDraft && (
        <>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => detail.setSendDialogOpen(true)}
          >
            Send Invoice
          </Button>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => router.push(`/app/invoices/${invoiceId}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={() => detail.setPreviewDialogOpen(true)}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            Preview
          </Button>
        </>
      )}
      {!isDraft && (
        <Button variant="outlined" startIcon={<LinkIcon />} onClick={detail.copyPublicLink}>
          Copy Link
        </Button>
      )}
      {!isPaid && !isDraft && (
        <Button
          variant="outlined"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => detail.setPaymentDialogOpen(true)}
        >
          Record Payment
        </Button>
      )}
      {!isPaid && !isPartiallyPaid && (
        <Button
          variant="outlined"
          startIcon={<CheckCircleIcon />}
          onClick={() => detail.setMarkPaidDialogOpen(true)}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          Mark Paid
        </Button>
      )}
      <InvoiceOverflowMenu
        isDraft={isDraft}
        isPaid={isPaid}
        isPartiallyPaid={isPartiallyPaid}
        isDuplicating={detail.duplicateMutation.isPending}
        onPreview={() => detail.setPreviewDialogOpen(true)}
        onMarkPaid={() => detail.setMarkPaidDialogOpen(true)}
        onDownloadPdf={detail.handleDownloadPdf}
        onDuplicate={detail.handleDuplicate}
        onDelete={detail.handleDelete}
      />
    </Box>
  );
}

interface DetailHeaderProps {
  invoice: Invoice;
  status: { label: string; color: "success" | "error" | "info" | "warning" | "default" };
  isDraft: boolean;
  isPaid: boolean;
  isPartiallyPaid: boolean;
  invoiceId: string;
  detail: InvoiceDetailReturn;
}

function DetailHeader({
  invoice,
  status,
  isDraft,
  isPaid,
  isPartiallyPaid,
  invoiceId,
  detail,
}: DetailHeaderProps) {
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Invoices", href: "/app/invoices" }, { label: `#${invoice.publicId}` }]}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
            <Typography variant="h4" component="h1" fontWeight={700}>
              Invoice #{invoice.publicId}
            </Typography>
            <Chip label={status.label} color={status.color} sx={{ fontWeight: 600 }} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Created on {formatDate(invoice.createdAt)}
          </Typography>
        </Box>

        <DetailActions
          isDraft={isDraft}
          isPaid={isPaid}
          isPartiallyPaid={isPartiallyPaid}
          invoiceId={invoiceId}
          detail={detail}
        />
      </Box>
    </>
  );
}

function TotalsSummary({
  invoice,
  remainingBalance,
}: {
  invoice: Invoice;
  remainingBalance: number;
}) {
  const theme = useTheme();
  const paidPercentage = invoice.total > 0 ? ((invoice.paidAmount || 0) / invoice.total) * 100 : 0;

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Box sx={{ minWidth: 280 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography color="text.secondary">Subtotal</Typography>
          <Typography>{formatCurrency(invoice.subtotal, invoice.currency)}</Typography>
        </Box>
        <Divider sx={{ my: 1.5 }} />
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}
        >
          <Typography variant="h6" fontWeight={600}>
            Total
          </Typography>
          <Typography variant="h5" fontWeight={700} color="primary.main">
            {formatCurrency(invoice.total, invoice.currency)}
          </Typography>
        </Box>
        {(invoice.paidAmount || 0) > 0 && (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography color="success.main" fontWeight={500}>
                Paid
              </Typography>
              <Typography color="success.main" fontWeight={500}>
                -{formatCurrency(invoice.paidAmount || 0, invoice.currency)}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={paidPercentage}
              sx={{
                height: 6,
                borderRadius: 1,
                mb: 1.5,
                bgcolor: alpha(theme.palette.success.main, 0.1),
                "& .MuiLinearProgress-bar": { bgcolor: "success.main" },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography
                fontWeight={600}
                color={remainingBalance > 0 ? "error.main" : "success.main"}
              >
                {remainingBalance > 0 ? "Balance Due" : "Fully Paid"}
              </Typography>
              <Typography
                variant="h6"
                fontWeight={700}
                color={remainingBalance > 0 ? "error.main" : "success.main"}
              >
                {formatCurrency(remainingBalance, invoice.currency)}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

function BillingCard({
  invoice,
  remainingBalance,
}: {
  invoice: Invoice;
  remainingBalance: number;
}) {
  return (
    <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: "block" }}>
          Bill To
        </Typography>
        <Typography variant="h6" fontWeight={600}>
          {invoice.client.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {invoice.client.email}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, border: 0 }}>Description</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, border: 0 }}>
                Qty
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, border: 0 }}>
                Unit Price
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, border: 0 }}>
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoice.items.map((item) => (
              <TableRow key={item.id} sx={{ "&:last-child td": { border: 0 } }}>
                <TableCell>{item.description}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  {formatCurrency(item.unitPrice, invoice.currency)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>
                  {formatCurrency(item.amount, invoice.currency)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 3 }} />
      <TotalsSummary invoice={invoice} remainingBalance={remainingBalance} />
    </Paper>
  );
}

function DetailDialogs({
  invoice,
  detail,
  remainingBalance,
}: {
  invoice: Invoice;
  detail: InvoiceDetailReturn;
  remainingBalance: number;
}) {
  return (
    <>
      <SendDialog
        open={detail.sendDialogOpen}
        onClose={() => detail.setSendDialogOpen(false)}
        onConfirm={detail.handleSendInvoice}
        isLoading={detail.sendMutation.isPending}
        clientEmail={invoice.client.email}
      />
      <MarkPaidDialog
        open={detail.markPaidDialogOpen}
        onClose={() => detail.setMarkPaidDialogOpen(false)}
        onConfirm={detail.handleMarkPaid}
        isLoading={detail.markPaidMutation.isPending}
      />
      <RecordPaymentDialog
        open={detail.paymentDialogOpen}
        onClose={() => detail.setPaymentDialogOpen(false)}
        onConfirm={detail.handleRecordPayment}
        isLoading={detail.recordPaymentMutation.isPending}
        remainingBalance={remainingBalance}
        currency={invoice.currency}
      />
      <ConfirmDialog {...detail.dialogProps} />
      <InvoicePreviewDialog
        open={detail.previewDialogOpen}
        onClose={() => detail.setPreviewDialogOpen(false)}
        onSend={() => {
          detail.setPreviewDialogOpen(false);
          detail.setSendDialogOpen(true);
        }}
        invoice={invoice}
      />
    </>
  );
}

export function InvoiceDetailContent() {
  const params = useParams();
  const invoiceId = String(params.id);
  const { data: invoice, isLoading, error } = useInvoice(invoiceId);
  const detail = useInvoiceDetail(invoiceId, invoice);

  if (isLoading) {
    return (
      <AppLayout>
        <PageLoader message="Loading invoice..." />
      </AppLayout>
    );
  }

  if (error || !invoice) {
    return (
      <AppLayout>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Failed to load invoice. Please try again.
        </Alert>
      </AppLayout>
    );
  }

  const isDraft = invoice.status === "DRAFT";
  const isPaid = invoice.status === "PAID";
  const isPartiallyPaid = invoice.status === "PARTIALLY_PAID";
  const isOverdue = invoice.status === "OVERDUE";
  const status = STATUS_CONFIG[invoice.status] || STATUS_CONFIG.DRAFT;
  const remainingBalance = invoice.total - (invoice.paidAmount || 0);

  return (
    <AppLayout>
      <DetailHeader
        invoice={invoice}
        status={status}
        isDraft={isDraft}
        isPaid={isPaid}
        isPartiallyPaid={isPartiallyPaid}
        invoiceId={invoiceId}
        detail={detail}
      />

      <InvoiceTimeline
        dueDate={invoice.dueDate}
        sentAt={invoice.sentAt}
        viewedAt={invoice.viewedAt}
        paidAt={invoice.paidAt}
        paymentMethod={invoice.paymentMethod}
        isOverdue={isOverdue}
      />

      <BillingCard invoice={invoice} remainingBalance={remainingBalance} />

      <PaymentHistory
        payments={invoice.payments || []}
        currency={invoice.currency}
        isPaid={isPaid}
        expanded={detail.paymentsExpanded}
        onToggle={() => detail.setPaymentsExpanded(!detail.paymentsExpanded)}
        onDeletePayment={detail.handleDeletePayment}
      />

      {!isDraft && (
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Button
            variant="text"
            endIcon={<OpenInNewIcon />}
            onClick={() => window.open(`/i/${invoice.publicId}`, "_blank")}
          >
            View Public Invoice Page
          </Button>
        </Box>
      )}

      <ActivityHistory
        events={invoice.events || []}
        expanded={detail.auditLogExpanded}
        onToggle={() => detail.setAuditLogExpanded(!detail.auditLogExpanded)}
      />

      <DetailDialogs invoice={invoice} detail={detail} remainingBalance={remainingBalance} />
    </AppLayout>
  );
}
