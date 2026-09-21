"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/molecules/DateRangePicker";
import { SearchInput } from "@/components/molecules/SearchInput";
import { toIsoDate } from "@/lib/date";
import { EXPENSE_CATEGORIES } from "@/features/expenses/model/constants";
import type { ExpenseCategory } from "@/features/expenses/model/types";
import type { UseExpenseFiltersResult } from "@/features/expenses/controller/useExpenseFilters";

const FiltersContext = createContext<UseExpenseFiltersResult | null>(null);

function useFiltersContext(): UseExpenseFiltersResult {
  const context = useContext(FiltersContext);
  if (!context) throw new Error("ExpenseFilters subcomponents must be used within <ExpenseFilters>");
  return context;
}

interface ExpenseFiltersRootProps {
  filters: UseExpenseFiltersResult;
  children: ReactNode;
}

function ExpenseFiltersRoot({ filters, children }: ExpenseFiltersRootProps) {
  return (
    <FiltersContext.Provider value={filters}>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </FiltersContext.Provider>
  );
}

function Search() {
  const t = useTranslations("expenses.filters");
  const { criteria, setSearchText } = useFiltersContext();

  return (
    <SearchInput
      value={criteria.searchText ?? ""}
      onChange={setSearchText}
      placeholder={t("search")}
      className="w-full sm:w-56"
    />
  );
}

function CategorySelect() {
  const t = useTranslations();
  const { criteria, setCategory } = useFiltersContext();

  return (
    <Select
      value={criteria.category ?? "All"}
      onValueChange={(value) => setCategory(value as ExpenseCategory | "All")}
    >
      <SelectTrigger className="w-full sm:w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">{t("expenses.filters.allCategories")}</SelectItem>
        {EXPENSE_CATEGORIES.map((category) => (
          <SelectItem key={category} value={category}>
            {t(`categories.${category}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function DateRangeFilter() {
  const { criteria, setDateRange } = useFiltersContext();

  const value: DateRange | undefined = criteria.startDate
    ? {
        from: new Date(`${criteria.startDate}T00:00:00`),
        to: criteria.endDate ? new Date(`${criteria.endDate}T00:00:00`) : undefined,
      }
    : undefined;

  return (
    <DateRangePicker
      value={value}
      onChange={(range) =>
        setDateRange(
          range?.from ? toIsoDate(range.from) : undefined,
          range?.to ? toIsoDate(range.to) : undefined
        )
      }
    />
  );
}

function ClearButton() {
  const t = useTranslations("expenses.filters");
  const { hasActiveFilters, clearFilters } = useFiltersContext();

  if (!hasActiveFilters) return null;

  return (
    <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
      <X className="size-3.5" />
      {t("clear")}
    </Button>
  );
}

export const ExpenseFilters = Object.assign(ExpenseFiltersRoot, {
  Search,
  CategorySelect,
  DateRange: DateRangeFilter,
  ClearButton,
});
