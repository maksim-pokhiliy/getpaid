"use client";

import { Box, useTheme } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CardSkeleton } from "@app/shared/ui/loading";
import { formatCurrencyCompact } from "@app/shared/lib/format";

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

interface RevenueChartProps {
  isLoading: boolean;
  monthlyRevenue: MonthlyRevenue[];
  displayCurrency: string;
}

export function RevenueChart({ isLoading, monthlyRevenue, displayCurrency }: RevenueChartProps) {
  const theme = useTheme();

  if (isLoading) {
    return <CardSkeleton />;
  }

  return (
    <Box role="img" aria-label={`Revenue chart showing last 6 months in ${displayCurrency}`}>
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
              formatCurrencyCompact(value as number, displayCurrency),
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
    </Box>
  );
}
