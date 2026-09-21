import { describe, expect, it } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import type { Expense } from "@/features/expenses/model/types";
import { ExpenseAmount } from "./ExpenseAmount";

function buildExpense(overrides: Partial<Expense>): Expense {
  return {
    id: "1",
    date: "2026-03-05",
    amount: 100,
    currency: "USD",
    category: "Food",
    description: "Groceries",
    createdAt: "x",
    updatedAt: "x",
    ...overrides,
  };
}

describe("ExpenseAmount", () => {
  it("shows the amount in the expense's own currency", () => {
    const expense = buildExpense({ amount: 42.5, currency: "USD" });
    renderWithProviders(<ExpenseAmount expense={expense} />, {
      initialSettings: { locale: "en-US", currency: "USD" },
    });

    expect(screen.getByText("$42.50")).toBeInTheDocument();
  });

  it("does not show a converted hint when the expense is already in the base currency", () => {
    const expense = buildExpense({ amount: 42.5, currency: "USD" });
    renderWithProviders(<ExpenseAmount expense={expense} convertedAmount={42.5} />, {
      initialSettings: { locale: "en-US", currency: "USD" },
    });

    expect(screen.queryByText(/≈/)).not.toBeInTheDocument();
  });

  it("shows a converted hint when the expense's currency differs from the base currency", () => {
    const expense = buildExpense({ amount: 100, currency: "EUR" });
    renderWithProviders(<ExpenseAmount expense={expense} convertedAmount={108.5} />, {
      initialSettings: { locale: "en-US", currency: "USD" },
    });

    expect(screen.getByText("€100.00")).toBeInTheDocument();
    expect(screen.getByText("≈ $108.50")).toBeInTheDocument();
  });

  it("omits the converted hint while the conversion is still unresolved", () => {
    const expense = buildExpense({ amount: 100, currency: "EUR" });
    renderWithProviders(<ExpenseAmount expense={expense} />, {
      initialSettings: { locale: "en-US", currency: "USD" },
    });

    expect(screen.queryByText(/≈/)).not.toBeInTheDocument();
  });
});
