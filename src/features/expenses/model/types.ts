import type { CurrencyCode } from "@/features/settings/model/types";

export type ExpenseCategory =
  | "Food"
  | "Transportation"
  | "Entertainment"
  | "Shopping"
  | "Bills"
  | "Other";

export interface Expense {
  id: string;
  date: string; // ISO calendar date, "yyyy-MM-dd"
  amount: number; // raw, positive, in `currency`
  currency: CurrencyCode; // the currency the expense was actually entered in
  category: ExpenseCategory;
  description: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export type NewExpense = Omit<Expense, "id" | "createdAt" | "updatedAt">;
export type ExpenseUpdate = Partial<NewExpense>;

export interface ExpenseFilterCriteria {
  startDate?: string; // ISO date, inclusive
  endDate?: string; // ISO date, inclusive
  category?: ExpenseCategory | "All";
  searchText?: string; // matches description, case-insensitive
}
