import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/test-utils";
import type { MonthlyTrendPoint } from "@/features/dashboard/model/types";
import { MonthlyTrendChart } from "./MonthlyTrendChart";

const data: MonthlyTrendPoint[] = [
  { month: "2026-08", total: 100 },
  { month: "2026-09", total: 200 },
];

describe("MonthlyTrendChart", () => {
  it("renders an area chart without crashing", () => {
    const { container } = renderWithProviders(<MonthlyTrendChart data={data} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
