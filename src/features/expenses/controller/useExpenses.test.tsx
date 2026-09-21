import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import messages from "@/messages/en-US.json";
import type { Expense, ExpenseUpdate, NewExpense } from "../model/types";
import type { ExpenseRepository } from "../services/expenseRepository";
import { useExpenses } from "./useExpenses";

class FakeExpenseRepository implements ExpenseRepository {
  private expenses: Expense[];
  private nextId = 1;

  constructor(initial: Expense[] = []) {
    this.expenses = initial;
  }

  async getAll() {
    return this.expenses;
  }

  async create(input: NewExpense) {
    const expense: Expense = {
      ...input,
      id: `id-${this.nextId++}`,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };
    this.expenses = [...this.expenses, expense];
    return expense;
  }

  async update(id: string, updates: ExpenseUpdate) {
    const existing = this.expenses.find((expense) => expense.id === id);
    if (!existing) throw new Error("not found");
    const updated = { ...existing, ...updates };
    this.expenses = this.expenses.map((expense) => (expense.id === id ? updated : expense));
    return updated;
  }

  async remove(id: string) {
    this.expenses = this.expenses.filter((expense) => expense.id !== id);
  }
}

function wrapper({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="en-US" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

const sample: NewExpense = {
  date: "2026-03-05",
  amount: 42.5,
  currency: "USD",
  category: "Food",
  description: "Groceries",
};

describe("useExpenses", () => {
  it("hydrates from the repository", async () => {
    const seeded: Expense = { ...sample, id: "seed", createdAt: "x", updatedAt: "x" };
    const repository = new FakeExpenseRepository([seeded]);

    const { result } = renderHook(() => useExpenses({ repository }), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.expenses).toEqual([seeded]);
  });

  it("adds an expense", async () => {
    const repository = new FakeExpenseRepository();
    const { result } = renderHook(() => useExpenses({ repository }), { wrapper });
    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    const success = await result.current.addExpense(sample);

    expect(success).toBe(true);
    await waitFor(() => expect(result.current.expenses).toHaveLength(1));
    expect(result.current.expenses[0]).toMatchObject(sample);
  });

  it("edits an expense", async () => {
    const repository = new FakeExpenseRepository();
    const { result } = renderHook(() => useExpenses({ repository }), { wrapper });
    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    await result.current.addExpense(sample);
    await waitFor(() => expect(result.current.expenses).toHaveLength(1));

    const id = result.current.expenses[0].id;
    await result.current.editExpense(id, { amount: 100 });

    await waitFor(() => expect(result.current.expenses[0].amount).toBe(100));
  });

  it("deletes an expense", async () => {
    const repository = new FakeExpenseRepository();
    const { result } = renderHook(() => useExpenses({ repository }), { wrapper });
    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    await result.current.addExpense(sample);
    await waitFor(() => expect(result.current.expenses).toHaveLength(1));

    const id = result.current.expenses[0].id;
    await result.current.deleteExpense(id);

    await waitFor(() => expect(result.current.expenses).toHaveLength(0));
  });

  it("reports failure without mutating state when the repository throws", async () => {
    const failingRepository: ExpenseRepository = {
      getAll: () => Promise.resolve([]),
      create: () => Promise.reject(new Error("boom")),
      update: () => Promise.reject(new Error("boom")),
      remove: () => Promise.reject(new Error("boom")),
    };

    const { result } = renderHook(() => useExpenses({ repository: failingRepository }), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    const success = await result.current.addExpense(sample);

    expect(success).toBe(false);
    expect(result.current.expenses).toHaveLength(0);
  });
});
