import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test/test-utils";
import type { Expense } from "@/features/expenses/model/types";
import { ExpenseTable } from "./ExpenseTable";

const expenses: Expense[] = [
  {
    id: "1",
    date: "2026-03-05",
    amount: 42.5,
    currency: "USD",
    category: "Food",
    description: "Groceries",
    createdAt: "x",
    updatedAt: "x",
  },
];

describe("ExpenseTable", () => {
  it("shows the empty message when there are no expenses", () => {
    renderWithProviders(
      <ExpenseTable expenses={[]} emptyMessage="Nothing here" onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders a row per expense with formatted amount and category", () => {
    renderWithProviders(
      <ExpenseTable expenses={expenses} emptyMessage="" onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("$42.50")).toBeInTheDocument();
  });

  it("shows the amount in the expense's own currency plus a converted hint when it differs from the base currency", () => {
    const foreignExpense: Expense = {
      ...expenses[0],
      id: "2",
      currency: "EUR",
    };

    renderWithProviders(
      <ExpenseTable
        expenses={[foreignExpense]}
        emptyMessage=""
        convertedAmounts={{ "2": 46.1 }}
      />,
      { initialSettings: { locale: "en-US", currency: "USD" } }
    );

    expect(screen.getByText("€42.50")).toBeInTheDocument();
    expect(screen.getByText("≈ $46.10")).toBeInTheDocument();
  });

  it("invokes onEdit through the row actions menu", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    renderWithProviders(
      <ExpenseTable expenses={expenses} emptyMessage="" onEdit={onEdit} onDelete={vi.fn()} />
    );

    await user.click(screen.getByRole("button", { name: "Actions" }));
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }));

    expect(onEdit).toHaveBeenCalledWith(expenses[0]);
  });
});
