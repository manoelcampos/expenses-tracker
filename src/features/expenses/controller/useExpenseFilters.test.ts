import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Expense } from "../model/types";
import { applyExpenseFilters, useExpenseFilters } from "./useExpenseFilters";

const expenses: Expense[] = [
  {
    id: "1",
    date: "2026-03-01",
    amount: 10,
    category: "Food",
    description: "Groceries",
    createdAt: "x",
    updatedAt: "x",
  },
  {
    id: "2",
    date: "2026-03-10",
    amount: 20,
    category: "Entertainment",
    description: "Movie night",
    createdAt: "x",
    updatedAt: "x",
  },
  {
    id: "3",
    date: "2026-04-01",
    amount: 30,
    category: "Food",
    description: "Restaurant",
    createdAt: "x",
    updatedAt: "x",
  },
];

describe("applyExpenseFilters", () => {
  it("returns everything when criteria is empty", () => {
    expect(applyExpenseFilters(expenses, {})).toHaveLength(3);
  });

  it("filters by date range (inclusive)", () => {
    const result = applyExpenseFilters(expenses, {
      startDate: "2026-03-01",
      endDate: "2026-03-10",
    });
    expect(result.map((e) => e.id)).toEqual(["1", "2"]);
  });

  it("filters by category", () => {
    const result = applyExpenseFilters(expenses, { category: "Food" });
    expect(result.map((e) => e.id)).toEqual(["1", "3"]);
  });

  it("treats category 'All' as no filter", () => {
    expect(applyExpenseFilters(expenses, { category: "All" })).toHaveLength(3);
  });

  it("filters by case-insensitive search text", () => {
    const result = applyExpenseFilters(expenses, { searchText: "movie" });
    expect(result.map((e) => e.id)).toEqual(["2"]);
  });

  it("combines multiple criteria", () => {
    const result = applyExpenseFilters(expenses, {
      category: "Food",
      searchText: "restaurant",
    });
    expect(result.map((e) => e.id)).toEqual(["3"]);
  });
});

describe("useExpenseFilters", () => {
  it("exposes filtered results and reports whether filters are active", () => {
    const { result } = renderHook(() => useExpenseFilters(expenses));

    expect(result.current.filteredExpenses).toHaveLength(3);
    expect(result.current.hasActiveFilters).toBe(false);

    act(() => result.current.setCategory("Food"));

    expect(result.current.filteredExpenses.map((e) => e.id)).toEqual(["1", "3"]);
    expect(result.current.hasActiveFilters).toBe(true);

    act(() => result.current.clearFilters());

    expect(result.current.filteredExpenses).toHaveLength(3);
    expect(result.current.hasActiveFilters).toBe(false);
  });
});
