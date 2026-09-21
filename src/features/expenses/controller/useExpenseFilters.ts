"use client";

import { useCallback, useMemo, useState } from "react";
import type { Expense, ExpenseCategory, ExpenseFilterCriteria } from "../model/types";

const EMPTY_CRITERIA: ExpenseFilterCriteria = { category: "All" };

export function applyExpenseFilters(
  expenses: Expense[],
  criteria: ExpenseFilterCriteria
): Expense[] {
  const search = criteria.searchText?.trim().toLowerCase();

  return expenses.filter((expense) => {
    if (criteria.startDate && expense.date < criteria.startDate) return false;
    if (criteria.endDate && expense.date > criteria.endDate) return false;
    if (
      criteria.category &&
      criteria.category !== "All" &&
      expense.category !== criteria.category
    ) {
      return false;
    }
    if (search && !expense.description.toLowerCase().includes(search)) return false;
    return true;
  });
}

export interface UseExpenseFiltersResult {
  criteria: ExpenseFilterCriteria;
  filteredExpenses: Expense[];
  hasActiveFilters: boolean;
  setDateRange: (startDate?: string, endDate?: string) => void;
  setCategory: (category: ExpenseCategory | "All") => void;
  setSearchText: (searchText: string) => void;
  clearFilters: () => void;
}

export function useExpenseFilters(expenses: Expense[]): UseExpenseFiltersResult {
  const [criteria, setCriteria] = useState<ExpenseFilterCriteria>(EMPTY_CRITERIA);

  const setDateRange = useCallback((startDate?: string, endDate?: string) => {
    setCriteria((prev) => ({ ...prev, startDate, endDate }));
  }, []);

  const setCategory = useCallback((category: ExpenseCategory | "All") => {
    setCriteria((prev) => ({ ...prev, category }));
  }, []);

  const setSearchText = useCallback((searchText: string) => {
    setCriteria((prev) => ({ ...prev, searchText }));
  }, []);

  const clearFilters = useCallback(() => setCriteria(EMPTY_CRITERIA), []);

  const filteredExpenses = useMemo(
    () => applyExpenseFilters(expenses, criteria),
    [expenses, criteria]
  );

  const hasActiveFilters = Boolean(
    criteria.startDate ||
      criteria.endDate ||
      (criteria.category && criteria.category !== "All") ||
      criteria.searchText
  );

  return { criteria, filteredExpenses, hasActiveFilters, setDateRange, setCategory, setSearchText, clearFilters };
}
