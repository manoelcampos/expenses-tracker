"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryBadge } from "@/components/atoms/CategoryBadge";
import { ExpenseAmount } from "@/components/molecules/ExpenseAmount";
import { ExpenseRowActions } from "@/components/molecules/ExpenseRowActions";
import { formatDate } from "@/lib/date";
import type { Expense } from "@/features/expenses/model/types";

interface ExpenseTableProps {
  expenses: Expense[];
  emptyMessage: string;
  /** expense id -> amount converted to the base currency, for the "≈" hint on foreign-currency rows */
  convertedAmounts?: Record<string, number>;
  onEdit?: (expense: Expense) => void;
  onDelete?: (expense: Expense) => void;
  className?: string;
}

export function ExpenseTable({
  expenses,
  emptyMessage,
  convertedAmounts,
  onEdit,
  onDelete,
  className,
}: ExpenseTableProps) {
  const showActions = Boolean(onEdit || onDelete);
  const t = useTranslations("expenses");
  const locale = useLocale();

  if (expenses.length === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("fields.date")}</TableHead>
            <TableHead>{t("fields.description")}</TableHead>
            <TableHead>{t("fields.category")}</TableHead>
            <TableHead className="text-right">{t("fields.amount")}</TableHead>
            {showActions && (
              <TableHead className="w-10">
                <span className="sr-only">{t("table.actions")}</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="whitespace-nowrap">{formatDate(expense.date, locale)}</TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>
                <CategoryBadge category={expense.category} />
              </TableCell>
              <TableCell className="text-right font-medium">
                <ExpenseAmount
                  expense={expense}
                  convertedAmount={convertedAmounts?.[expense.id]}
                  className="items-end"
                />
              </TableCell>
              {showActions && (
                <TableCell>
                  <ExpenseRowActions
                    onEdit={() => onEdit?.(expense)}
                    onDelete={() => onDelete?.(expense)}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
