import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/test-utils";
import type { CategoryBreakdown } from "@/features/dashboard/model/types";
import { SpendingByCategoryChart } from "./SpendingByCategoryChart";

const data: CategoryBreakdown[] = [
  { category: "Food", total: 150, percentage: 75, count: 2 },
  { category: "Bills", total: 50, percentage: 25, count: 1 },
];

describe("SpendingByCategoryChart", () => {
  it("renders a bar per category", () => {
    const { container } = renderWithProviders(<SpendingByCategoryChart data={data} />);

    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelectorAll(".recharts-bar-rectangle")).toHaveLength(
      data.length
    );
  });
});
