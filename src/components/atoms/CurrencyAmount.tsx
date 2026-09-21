"use client";

import { useLocale } from "next-intl";
import { formatCurrency } from "@/lib/currency";
import { useCurrentCurrency } from "@/features/settings/controller/SettingsContext";
import { cn } from "@/lib/utils";
import type { CurrencyCode } from "@/features/settings/model/types";

interface CurrencyAmountProps {
  amount: number;
  /** Overrides the app's base currency, e.g. to show an expense in the currency it was entered in. */
  currency?: CurrencyCode;
  className?: string;
}

export function CurrencyAmount({ amount, currency, className }: CurrencyAmountProps) {
  const baseCurrency = useCurrentCurrency();
  const locale = useLocale();

  return (
    <span className={cn("tabular-nums", className)}>
      {formatCurrency(amount, currency ?? baseCurrency, locale)}
    </span>
  );
}
