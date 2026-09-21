import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test/test-utils";
import type { Expense } from "@/features/expenses/model/types";
import { ExpenseCardList } from "./ExpenseCardList";

const expenses: Expense[] = [
  {
    id: "1",
    date: "2026-03-05",
    amount: 42.5,
    category: "Food",
    description: "Groceries",
    createdAt: "x",
    updatedAt: "x",
  },
];

describe("ExpenseCardList", () => {
  it("shows the empty message when there are no expenses", () => {
    renderWithProviders(
      <ExpenseCardList expenses={[]} emptyMessage="Nothing here" onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("invokes onDelete through the row actions menu", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    renderWithProviders(
      <ExpenseCardList expenses={expenses} emptyMessage="" onEdit={vi.fn()} onDelete={onDelete} />
    );

    await user.click(screen.getByRole("button", { name: "Actions" }));
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }));

    expect(onDelete).toHaveBeenCalledWith(expenses[0]);
  });
});
