"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { StorageError } from "@/lib/storage";
import type { Expense, ExpenseUpdate, NewExpense } from "../model/types";
import { LocalStorageExpenseRepository } from "../services/localStorageExpenseRepository";
import type { ExpenseRepository } from "../services/expenseRepository";

export interface UseExpensesOptions {
  repository?: ExpenseRepository;
  initialExpenses?: Expense[];
}

export interface UseExpensesResult {
  expenses: Expense[];
  isHydrated: boolean;
  addExpense: (input: NewExpense) => Promise<boolean>;
  editExpense: (id: string, updates: ExpenseUpdate) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
}

export function useExpenses({
  repository,
  initialExpenses,
}: UseExpensesOptions = {}): UseExpensesResult {
  const t = useTranslations();
  const repo = useMemo(
    () => repository ?? new LocalStorageExpenseRepository(),
    [repository]
  );

  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses ?? []);
  const [isHydrated, setIsHydrated] = useState(Boolean(initialExpenses));

  useEffect(() => {
    if (initialExpenses) return;

    let cancelled = false;

    async function hydrate() {
      try {
        const all = await repo.getAll();
        if (!cancelled) setExpenses(all);
      } catch (error) {
        if (error instanceof StorageError) toast.error(t("common.storageReadError"));
      } finally {
        if (!cancelled) setIsHydrated(true);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addExpense = useCallback(
    async (input: NewExpense) => {
      try {
        const created = await repo.create(input);
        setExpenses((prev) => [...prev, created]);
        toast.success(t("expenses.form.created"));
        return true;
      } catch {
        toast.error(t("common.storageError"));
        return false;
      }
    },
    [repo, t]
  );

  const editExpense = useCallback(
    async (id: string, updates: ExpenseUpdate) => {
      try {
        const updated = await repo.update(id, updates);
        setExpenses((prev) => prev.map((expense) => (expense.id === id ? updated : expense)));
        toast.success(t("expenses.form.updated"));
        return true;
      } catch {
        toast.error(t("common.storageError"));
        return false;
      }
    },
    [repo, t]
  );

  const deleteExpense = useCallback(
    async (id: string) => {
      try {
        await repo.remove(id);
        setExpenses((prev) => prev.filter((expense) => expense.id !== id));
        toast.success(t("expenses.form.deleted"));
        return true;
      } catch {
        toast.error(t("common.storageError"));
        return false;
      }
    },
    [repo, t]
  );

  return { expenses, isHydrated, addExpense, editExpense, deleteExpense };
}
