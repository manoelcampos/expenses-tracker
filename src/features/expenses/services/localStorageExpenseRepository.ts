import { generateId } from "@/lib/id";
import { readJson, writeJson } from "@/lib/storage";
import { EXPENSES_STORAGE_KEY } from "../model/constants";
import type { Expense, ExpenseUpdate, NewExpense } from "../model/types";
import type { ExpenseRepository } from "./expenseRepository";

export class ExpenseNotFoundError extends Error {
  constructor(id: string) {
    super(`Expense "${id}" was not found`);
    this.name = "ExpenseNotFoundError";
  }
}

const LEGACY_RECORD_FALLBACK_CURRENCY = "USD";

/** Shape of records saved before multi-currency support added `currency`. */
type StoredExpense = Omit<Expense, "currency"> & { currency?: Expense["currency"] };

export class LocalStorageExpenseRepository implements ExpenseRepository {
  private readAll(): Expense[] {
    const expenses = readJson<StoredExpense[]>(EXPENSES_STORAGE_KEY, []);
    return expenses.map((expense) => ({
      ...expense,
      currency: expense.currency ?? LEGACY_RECORD_FALLBACK_CURRENCY,
    }));
  }

  private writeAll(expenses: Expense[]): void {
    writeJson(EXPENSES_STORAGE_KEY, expenses);
  }

  async getAll(): Promise<Expense[]> {
    return this.readAll();
  }

  async create(input: NewExpense): Promise<Expense> {
    const now = new Date().toISOString();
    const expense: Expense = { ...input, id: generateId(), createdAt: now, updatedAt: now };

    this.writeAll([...this.readAll(), expense]);
    return expense;
  }

  async update(id: string, updates: ExpenseUpdate): Promise<Expense> {
    const expenses = this.readAll();
    const index = expenses.findIndex((expense) => expense.id === id);
    if (index === -1) throw new ExpenseNotFoundError(id);

    const updated: Expense = {
      ...expenses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    expenses[index] = updated;
    this.writeAll(expenses);
    return updated;
  }

  async remove(id: string): Promise<void> {
    this.writeAll(this.readAll().filter((expense) => expense.id !== id));
  }
}
