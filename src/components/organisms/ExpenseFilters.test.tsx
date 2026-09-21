import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test/test-utils";
import { useExpenseFilters } from "@/features/expenses/controller/useExpenseFilters";
import type { Expense } from "@/features/expenses/model/types";
import { ExpenseFilters } from "./ExpenseFilters";

const expenses: Expense[] = [
  {
    id: "1",
    date: "2026-03-01",
    amount: 10,
    currency: "USD",
    category: "Food",
    description: "Groceries",
    createdAt: "x",
    updatedAt: "x",
  },
  {
    id: "2",
    date: "2026-03-10",
    amount: 20,
    currency: "USD",
    category: "Entertainment",
    description: "Movie night",
    createdAt: "x",
    updatedAt: "x",
  },
];

function Harness() {
  const filters = useExpenseFilters(expenses);
  return (
    <div>
      <ExpenseFilters filters={filters}>
        <ExpenseFilters.Search />
        <ExpenseFilters.CategorySelect />
        <ExpenseFilters.ClearButton />
      </ExpenseFilters>
      <p data-testid="count">{filters.filteredExpenses.length}</p>
    </div>
  );
}

describe("ExpenseFilters", () => {
  it("filters the list via the category select and clears via the clear button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness />);

    expect(screen.getByTestId("count")).toHaveTextContent("2");
    expect(screen.queryByRole("button", { name: "Clear filters" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "Entertainment" }));

    expect(screen.getByTestId("count")).toHaveTextContent("1");

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByTestId("count")).toHaveTextContent("2");
  });

  it("filters the list via the search input", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness />);

    await user.type(screen.getByPlaceholderText("Search description"), "movie");

    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });
});

describe("useFiltersContext guard", () => {
  it("throws when a subcomponent is rendered outside the root", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderWithProviders(<ExpenseFilters.Search />)).toThrow(
      /must be used within <ExpenseFilters>/
    );
    spy.mockRestore();
  });
});
