import { describe, expect, it } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import { DashboardPageSection } from "./DashboardPageSection";

describe("DashboardPageSection", () => {
  it("shows the no-data message when there are no expenses", async () => {
    renderWithProviders(<DashboardPageSection />);

    expect(
      await screen.findByText("No expenses yet. Add your first expense to see your dashboard.")
    ).toBeInTheDocument();
  });
});
