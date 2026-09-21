import { describe, expect, it } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import type { DashboardMetrics } from "@/features/dashboard/model/types";
import { SummaryCards } from "./SummaryCards";

const metrics: DashboardMetrics = {
  totalSpending: 350,
  currentMonthSpending: 150,
  topCategory: "Bills",
  transactionCount: 3,
  categoryBreakdown: [],
  monthlyTrend: [],
};

describe("SummaryCards", () => {
  it("renders totals, top category and transaction count", () => {
    renderWithProviders(<SummaryCards metrics={metrics} />, {
      initialSettings: { locale: "en-US", currency: "USD" },
    });

    expect(screen.getByText("$350.00")).toBeInTheDocument();
    expect(screen.getByText("$150.00")).toBeInTheDocument();
    expect(screen.getByText("Bills")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("shows a fallback when there is no top category yet", () => {
    renderWithProviders(<SummaryCards metrics={{ ...metrics, topCategory: null }} />);
    expect(screen.getByText("None")).toBeInTheDocument();
  });
});
