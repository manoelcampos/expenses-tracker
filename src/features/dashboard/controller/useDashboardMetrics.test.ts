import { describe, expect, it } from "vitest";
import type { Expense } from "@/features/expenses/model/types";
import { computeDashboardMetrics } from "./useDashboardMetrics";

const referenceDate = new Date(2026, 8, 21); // 2026-09-21

const expenses: Expense[] = [
  {
    id: "1",
    date: "2026-09-05",
    amount: 100,
    category: "Food",
    description: "Groceries",
    currency: "USD",
    createdAt: "x",
    updatedAt: "x",
  },
  {
    id: "2",
    date: "2026-09-10",
    amount: 50,
    category: "Food",
    description: "Restaurant",
    currency: "USD",
    createdAt: "x",
    updatedAt: "x",
  },
  {
    id: "3",
    date: "2026-08-15",
    amount: 200,
    category: "Bills",
    description: "Rent",
    currency: "USD",
    createdAt: "x",
    updatedAt: "x",
  },
];

describe("computeDashboardMetrics", () => {
  it("returns zeroed metrics for an empty list", () => {
    const metrics = computeDashboardMetrics([], referenceDate);

    expect(metrics.totalSpending).toBe(0);
    expect(metrics.currentMonthSpending).toBe(0);
    expect(metrics.topCategory).toBeNull();
    expect(metrics.transactionCount).toBe(0);
    expect(metrics.categoryBreakdown.every((c) => c.total === 0)).toBe(true);
    expect(metrics.monthlyTrend).toHaveLength(6);
  });

  it("computes total spending and transaction count", () => {
    const metrics = computeDashboardMetrics(expenses, referenceDate);
    expect(metrics.totalSpending).toBe(350);
    expect(metrics.transactionCount).toBe(3);
  });

  it("computes current-month spending using only the reference month", () => {
    const metrics = computeDashboardMetrics(expenses, referenceDate);
    expect(metrics.currentMonthSpending).toBe(150);
  });

  it("identifies the top category by total spent", () => {
    const metrics = computeDashboardMetrics(expenses, referenceDate);
    expect(metrics.topCategory).toBe("Bills");
  });

  it("includes all six categories in the breakdown, zero-filled, sorted descending", () => {
    const metrics = computeDashboardMetrics(expenses, referenceDate);
    expect(metrics.categoryBreakdown).toHaveLength(6);
    expect(metrics.categoryBreakdown[0]).toMatchObject({ category: "Bills", total: 200 });
    expect(metrics.categoryBreakdown[1]).toMatchObject({ category: "Food", total: 150 });
    expect(metrics.categoryBreakdown.find((c) => c.category === "Other")).toMatchObject({
      total: 0,
      percentage: 0,
    });
  });

  it("builds a 6-month trend ending at the reference month, zero-filled", () => {
    const metrics = computeDashboardMetrics(expenses, referenceDate);
    expect(metrics.monthlyTrend.map((point) => point.month)).toEqual([
      "2026-04",
      "2026-05",
      "2026-06",
      "2026-07",
      "2026-08",
      "2026-09",
    ]);
    expect(metrics.monthlyTrend.find((p) => p.month === "2026-08")?.total).toBe(200);
    expect(metrics.monthlyTrend.find((p) => p.month === "2026-09")?.total).toBe(150);
    expect(metrics.monthlyTrend.find((p) => p.month === "2026-04")?.total).toBe(0);
  });
});
