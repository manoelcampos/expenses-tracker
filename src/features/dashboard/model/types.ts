import type { ExpenseCategory } from "@/features/expenses/model/types";

export interface CategoryBreakdown {
  category: ExpenseCategory;
  total: number;
  percentage: number; // 0-100, rounded to 1 decimal
  count: number;
}

export interface MonthlyTrendPoint {
  month: string; // "yyyy-MM"
  total: number;
}

export interface DashboardMetrics {
  totalSpending: number;
  currentMonthSpending: number;
  topCategory: ExpenseCategory | null;
  transactionCount: number;
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrend: MonthlyTrendPoint[];
}
