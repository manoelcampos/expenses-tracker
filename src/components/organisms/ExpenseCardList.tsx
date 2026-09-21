"use client";

import { useLocale } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge } from "@/components/atoms/CategoryBadge";
import { CurrencyAmount } from "@/components/atoms/CurrencyAmount";
import { ExpenseRowActions } from "@/components/molecules/ExpenseRowActions";
import { formatDate } from "@/lib/date";
import type { Expense } from "@/features/expenses/model/types";

interface ExpenseCardListProps {
  expenses: Expense[];
  emptyMessage: string;
  onEdit?: (expense: Expense) => void;
  onDelete?: (expense: Expense) => void;
  className?: string;
}

export function ExpenseCardList({
  expenses,
  emptyMessage,
  onEdit,
  onDelete,
  className,
}: ExpenseCardListProps) {
  const locale = useLocale();
  const showActions = Boolean(onEdit || onDelete);

  if (expenses.length === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-3">
        {expenses.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-1.5">
                <p className="truncate font-medium">{expense.description}</p>
                <p className="text-sm text-muted-foreground">{formatDate(expense.date, locale)}</p>
                <CategoryBadge category={expense.category} className="w-fit" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <CurrencyAmount amount={expense.amount} className="font-semibold" />
                {showActions && (
                  <ExpenseRowActions
                    onEdit={() => onEdit?.(expense)}
                    onDelete={() => onDelete?.(expense)}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
