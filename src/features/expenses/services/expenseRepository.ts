import type { Expense, ExpenseUpdate, NewExpense } from "../model/types";

export interface ExpenseRepository {
  getAll(): Promise<Expense[]>;
  create(input: NewExpense): Promise<Expense>;
  update(id: string, updates: ExpenseUpdate): Promise<Expense>;
  remove(id: string): Promise<void>;
}
