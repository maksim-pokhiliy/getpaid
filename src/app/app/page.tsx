"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Skeleton,
  Alert,
  Button,
  alpha,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import WarningIcon from "@mui/icons-material/Warning";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import { AppLayout } from "@app/components/layout/AppLayout";
import { useAnalytics } from "@app/lib/api";

function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount / 100);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
  color?: string;
}

function MetricCard({ title, value, icon, change, changeLabel, color }: MetricCardProps) {
  const theme = useTheme();
  const isPositive = change !== undefined && change >= 0;

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(color || theme.palette.primary.main, 0.1),
            color: color || theme.palette.primary.main,
          }}
        >
          {icon}
        </Box>
        {change !== undefined && (
          <Chip
            size="small"
            icon={isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
            label={`${isPositive ? "+" : ""}${change.toFixed(0)}%`}
            color={isPositive ? "success" : "error"}
            sx={{ fontWeight: 600 }}
          />
        )}
      </Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight={700}>
        {value}
      </Typography>
      {changeLabel && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
          {changeLabel}
        </Typography>
      )}
    </Paper>
  );
}

const statusColors: Record<string, string> = {
  PAID: "#22c55e",
  OVERDUE: "#ef4444",
  SENT: "#3b82f6",
  VIEWED: "#3b82f6",
  DRAFT: "#9ca3af",
};

export default function DashboardPage() {
  const router = useRouter();
  const theme = useTheme();
  const { data: analytics, isLoading, error } = useAnalytics();
  const [selectedCurrency, setSelectedCurrency] = React.useState<string | null>(null);

  // Set default currency when data loads
  React.useEffect(() => {
    if (analytics?.currencies && analytics.currencies.length > 0 && !selectedCurrency) {
      setSelectedCurrency(analytics.currencies[0]);
    }
  }, [analytics, selectedCurrency]);

  if (error) {
    return (
      <AppLayout>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Failed to load analytics data. Please try again.
        </Alert>
      </AppLayout>
    );
  }

  // Get currency-specific metrics or fallback to totals
  const currencyMetrics =
    selectedCurrency && analytics?.byCurrency ? analytics.byCurrency[selectedCurrency] : undefined;
  const displayCurrency = selectedCurrency || "USD";

  const totalRevenue = currencyMetrics?.totalRevenue ?? analytics?.totalRevenue ?? 0;
  const revenueThisMonth = currencyMetrics?.revenueThisMonth ?? analytics?.revenueThisMonth ?? 0;
  const revenueLastMonth = currencyMetrics?.revenueLastMonth ?? analytics?.revenueLastMonth ?? 0;
  const outstandingBalance =
    currencyMetrics?.outstandingBalance ?? analytics?.outstandingBalance ?? 0;
  const overdueAmount = currencyMetrics?.overdueAmount ?? analytics?.overdueAmount ?? 0;
  const monthlyRevenue = currencyMetrics?.monthlyRevenue ?? analytics?.monthlyRevenue ?? [];

  const revenueChange =
    revenueLastMonth > 0 ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 : 0;

  const hasMultipleCurrencies = (analytics?.currencies?.length ?? 0) > 1;

  return (
    <AppLayout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Overview of your invoicing activity
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {hasMultipleCurrencies && analytics?.currencies && (
            <ToggleButtonGroup
              value={selectedCurrency}
              exclusive
              onChange={(_, value) => value && setSelectedCurrency(value)}
              size="small"
              aria-label="Currency selection"
            >
              {analytics.currencies.map((currency) => (
                <ToggleButton key={currency} value={currency} sx={{ px: 2, fontWeight: 600 }}>
                  {currency}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push("/app/invoices/new")}
          >
            New Invoice
          </Button>
        </Box>
      </Box>

      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {isLoading ? (
            <Skeleton variant="rounded" height={160} />
          ) : (
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(totalRevenue, displayCurrency)}
              icon={<AccountBalanceWalletIcon />}
              color={theme.palette.success.main}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {isLoading ? (
            <Skeleton variant="rounded" height={160} />
          ) : (
            <MetricCard
              title="This Month"
              value={formatCurrency(revenueThisMonth, displayCurrency)}
              icon={<TrendingUpIcon />}
              change={revenueChange}
              changeLabel="vs last month"
              color={theme.palette.primary.main}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {isLoading ? (
            <Skeleton variant="rounded" height={160} />
          ) : (
            <MetricCard
              title="Outstanding"
              value={formatCurrency(outstandingBalance, displayCurrency)}
              icon={<ReceiptLongIcon />}
              color={theme.palette.warning.main}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {isLoading ? (
            <Skeleton variant="rounded" height={160} />
          ) : (
            <MetricCard
              title="Overdue"
              value={formatCurrency(overdueAmount, displayCurrency)}
              icon={<WarningIcon />}
              color={theme.palette.error.main}
            />
          )}
        </Grid>
      </Grid>

      {/* Charts and Lists */}
      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Revenue (Last 6 Months){hasMultipleCurrencies && ` - ${displayCurrency}`}
            </Typography>
            {isLoading ? (
              <Skeleton variant="rounded" height={320} />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: displayCurrency,
                        notation: "compact",
                        maximumFractionDigits: 0,
                      }).format(value / 100)
                    }
                  />
                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(value as number, displayCurrency),
                      "Revenue",
                    ]}
                    contentStyle={{
                      borderRadius: 8,
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="revenue" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Invoice Status */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Invoice Status
            </Typography>
            {isLoading ? (
              <Skeleton variant="rounded" height={320} />
            ) : (
              <Box sx={{ mt: 2 }}>
                {Object.entries(analytics?.statusCounts || {}).map(([status, count]) => (
                  <Box
                    key={status}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 1.5,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: statusColors[status] || "#9ca3af",
                        }}
                      />
                      <Typography variant="body2">{status}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={600}>
                      {count}
                    </Typography>
                  </Box>
                ))}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pt: 2,
                    mt: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <PeopleIcon fontSize="small" color="action" />
                    <Typography variant="body2">Total Clients</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>
                    {analytics?.clientCount || 0}
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Invoices */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Recent Invoices
              </Typography>
              <Button size="small" onClick={() => router.push("/app/invoices")}>
                View All
              </Button>
            </Box>
            {isLoading ? (
              <Skeleton variant="rounded" height={200} />
            ) : analytics?.recentInvoices.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography color="text.secondary">No invoices yet</Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => router.push("/app/invoices/new")}
                >
                  Create Your First Invoice
                </Button>
              </Box>
            ) : (
              <Box>
                {analytics?.recentInvoices.map((invoice) => (
                  <Box
                    key={invoice.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 1.5,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      cursor: "pointer",
                      "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                      "&:last-child": { borderBottom: "none" },
                      mx: -1,
                      px: 1,
                      borderRadius: 1,
                    }}
                    onClick={() => router.push(`/app/invoices/${invoice.id}`)}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        #{invoice.publicId}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {invoice.clientName} • {formatDate(invoice.createdAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(invoice.total, invoice.currency)}
                      </Typography>
                      <Chip
                        size="small"
                        label={invoice.status}
                        sx={{
                          bgcolor: alpha(statusColors[invoice.status] || "#9ca3af", 0.1),
                          color: statusColors[invoice.status] || "#9ca3af",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </AppLayout>
  );
}
