"use client";

import { useLocale, useTranslations } from "next-intl";
import { CurrencyAmount } from "@/components/atoms/CurrencyAmount";
import { useCurrentCurrency } from "@/features/settings/controller/SettingsContext";
import type { Expense } from "@/features/expenses/model/types";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface ExpenseAmountProps {
  expense: Expense;
  /** Amount converted to the app's base currency, when known and different from `expense.currency`. */
  convertedAmount?: number;
  className?: string;
}

export function ExpenseAmount({ expense, convertedAmount, className }: ExpenseAmountProps) {
  const t = useTranslations("expenses");
  const locale = useLocale();
  const baseCurrency = useCurrentCurrency();
  const showConverted = expense.currency !== baseCurrency && convertedAmount !== undefined;

  return (
    <div className={cn("flex flex-col items-end", className)}>
      <CurrencyAmount amount={expense.amount} currency={expense.currency} />
      {showConverted && (
        <span className="text-xs text-muted-foreground">
          {t("convertedApprox", {
            amount: formatCurrency(convertedAmount, baseCurrency, locale),
          })}
        </span>
      )}
    </div>
  );
}
