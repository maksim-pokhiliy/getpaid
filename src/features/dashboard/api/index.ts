import { fetchApi } from "@app/shared/api/base";

export interface CurrencyMetrics {
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  outstandingBalance: number;
  overdueAmount: number;
  monthlyRevenue: { month: string; revenue: number }[];
}

export interface AnalyticsData {
  currencies: string[];
  byCurrency: Record<string, CurrencyMetrics>;
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  outstandingBalance: number;
  overdueAmount: number;
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  statusCounts: Record<string, number>;
  monthlyRevenue: { month: string; revenue: number }[];
  clientCount: number;
  recentInvoices: {
    id: string;
    publicId: string;
    status: string;
    total: number;
    currency: string;
    clientName: string;
    createdAt: string;
  }[];
}

export const analyticsApi = {
  get: () => fetchApi<AnalyticsData>("/api/analytics"),
};
