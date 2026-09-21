"use client";

import { useMemo } from "react";
import { currentIsoMonth } from "@/lib/date";
import { EXPENSE_CATEGORIES } from "@/features/expenses/model/constants";
import type { Expense } from "@/features/expenses/model/types";
import type { CategoryBreakdown, DashboardMetrics, MonthlyTrendPoint } from "../model/types";

const TREND_MONTHS = 6;

function sumAmounts(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

function computeCategoryBreakdown(expenses: Expense[], totalSpending: number): CategoryBreakdown[] {
  return EXPENSE_CATEGORIES.map((category) => {
    const categoryExpenses = expenses.filter((expense) => expense.category === category);
    const total = sumAmounts(categoryExpenses);
    const percentage = totalSpending > 0 ? Math.round((total / totalSpending) * 1000) / 10 : 0;
    return { category, total, percentage, count: categoryExpenses.length };
  }).sort((a, b) => b.total - a.total);
}

function lastNIsoMonths(n: number, referenceDate: Date): string[] {
  return Array.from({ length: n }, (_, index) => {
    const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - (n - 1 - index), 1);
    return currentIsoMonth(date);
  });
}

function computeMonthlyTrend(expenses: Expense[], referenceDate: Date): MonthlyTrendPoint[] {
  const months = lastNIsoMonths(TREND_MONTHS, referenceDate);
  return months.map((month) => ({
    month,
    total: sumAmounts(expenses.filter((expense) => expense.date.slice(0, 7) === month)),
  }));
}

export function computeDashboardMetrics(
  expenses: Expense[],
  referenceDate: Date = new Date()
): DashboardMetrics {
  const totalSpending = sumAmounts(expenses);
  const currentMonth = currentIsoMonth(referenceDate);
  const currentMonthSpending = sumAmounts(
    expenses.filter((expense) => expense.date.slice(0, 7) === currentMonth)
  );

  const categoryBreakdown = computeCategoryBreakdown(expenses, totalSpending);
  const topCategory = categoryBreakdown[0]?.total > 0 ? categoryBreakdown[0].category : null;

  return {
    totalSpending,
    currentMonthSpending,
    topCategory,
    transactionCount: expenses.length,
    categoryBreakdown,
    monthlyTrend: computeMonthlyTrend(expenses, referenceDate),
  };
}

export function useDashboardMetrics(expenses: Expense[]): DashboardMetrics {
  return useMemo(() => computeDashboardMetrics(expenses), [expenses]);
}
