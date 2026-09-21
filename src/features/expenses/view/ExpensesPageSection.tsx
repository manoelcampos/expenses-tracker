"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExpenseTable } from "@/components/organisms/ExpenseTable";
import { ExpenseCardList } from "@/components/organisms/ExpenseCardList";
import { ExpenseFilters } from "@/components/organisms/ExpenseFilters";
import { ConfirmDeleteDialog } from "@/components/molecules/ConfirmDeleteDialog";
import { useExpenses } from "../controller/useExpenses";
import { useExpenseFilters } from "../controller/useExpenseFilters";
import { expensesToCsv, triggerCsvDownload } from "../services/csvExport";
import { useCurrentCurrency } from "@/features/settings/controller/SettingsContext";
import type { Expense } from "../model/types";
import type { ExpenseFormValues } from "../model/schema";
import { ExpenseFormDialog } from "./ExpenseFormDialog";

export function ExpensesPageSection() {
  const t = useTranslations("expenses");
  const currency = useCurrentCurrency();
  const { expenses, isHydrated, addExpense, editExpense, deleteExpense } = useExpenses();
  const filters = useExpenseFilters(expenses);

  const [formState, setFormState] = useState<{ open: boolean; expense: Expense | null }>({
    open: false,
    expense: null,
  });
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);

  const handleSubmit = async (values: ExpenseFormValues) =>
    formState.expense
      ? editExpense(formState.expense.id, values)
      : addExpense(values);

  const handleExportCsv = () => {
    const csv = expensesToCsv(filters.filteredExpenses, currency);
    triggerCsvDownload(`expenses-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const emptyMessage = filters.hasActiveFilters ? t("noResults") : t("empty");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <ExpenseFilters filters={filters}>
          <ExpenseFilters.Search />
          <ExpenseFilters.CategorySelect />
          <ExpenseFilters.DateRange />
          <ExpenseFilters.ClearButton />
        </ExpenseFilters>

        <div className="flex shrink-0 gap-2">
          <Button variant="outline" onClick={handleExportCsv} disabled={filters.filteredExpenses.length === 0}>
            <Download className="size-4" />
            {t("exportCsv")}
          </Button>
          <Button onClick={() => setFormState({ open: true, expense: null })}>
            <Plus className="size-4" />
            {t("addExpense")}
          </Button>
        </div>
      </div>

      {!isHydrated ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <>
          <ExpenseTable
            expenses={filters.filteredExpenses}
            emptyMessage={emptyMessage}
            onEdit={(expense) => setFormState({ open: true, expense })}
            onDelete={setDeleteTarget}
            className="hidden md:block"
          />
          <ExpenseCardList
            expenses={filters.filteredExpenses}
            emptyMessage={emptyMessage}
            onEdit={(expense) => setFormState({ open: true, expense })}
            onDelete={setDeleteTarget}
            className="md:hidden"
          />
        </>
      )}

      <ExpenseFormDialog
        open={formState.open}
        onOpenChange={(open) => setFormState((prev) => ({ ...prev, open }))}
        mode={formState.expense ? "edit" : "create"}
        defaultValues={formState.expense ?? undefined}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteExpense(deleteTarget.id)}
      />
    </div>
  );
}
