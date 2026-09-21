"use client";

import { useLocale } from "next-intl";
import { formatCurrency } from "@/lib/currency";
import { useCurrentCurrency } from "@/features/settings/controller/SettingsContext";
import { cn } from "@/lib/utils";

interface CurrencyAmountProps {
  amount: number;
  className?: string;
}

export function CurrencyAmount({ amount, className }: CurrencyAmountProps) {
  const currency = useCurrentCurrency();
  const locale = useLocale();

  return (
    <span className={cn("tabular-nums", className)}>
      {formatCurrency(amount, currency, locale)}
    </span>
  );
}
