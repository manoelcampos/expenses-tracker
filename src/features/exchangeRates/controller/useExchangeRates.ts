"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { CurrencyCode } from "@/features/settings/model/types";
import type { Expense } from "@/features/expenses/model/types";
import { CachedExchangeRateProvider } from "../services/cachedExchangeRateProvider";
import { FrankfurterExchangeRateProvider } from "../services/frankfurterExchangeRateProvider";
import type { ExchangeRateProvider } from "../services/exchangeRateProvider";

export interface UseExchangeRatesResult {
  /** expense id -> amount converted to the target currency */
  convertedAmounts: Record<string, number>;
  isConverting: boolean;
}

interface RatePair {
  currency: CurrencyCode;
  date: string;
}

function rateKey(from: CurrencyCode, date: string): string {
  return `${from}:${date}`;
}

function uniquePairsNeeding(
  expenses: Expense[],
  targetCurrency: CurrencyCode,
  resolvedRates: Map<string, number>
): RatePair[] {
  const pairs = new Map<string, RatePair>();
  for (const expense of expenses) {
    if (expense.currency === targetCurrency) continue;
    const key = rateKey(expense.currency, expense.date);
    if (!resolvedRates.has(key) && !pairs.has(key)) {
      pairs.set(key, { currency: expense.currency, date: expense.date });
    }
  }
  return Array.from(pairs.values());
}

async function resolveRates(
  provider: ExchangeRateProvider,
  pairs: RatePair[],
  targetCurrency: CurrencyCode
): Promise<{ rates: Map<string, number>; hadError: boolean }> {
  const rates = new Map<string, number>();
  let hadError = false;

  await Promise.all(
    pairs.map(async ({ currency, date }) => {
      try {
        rates.set(rateKey(currency, date), await provider.getRate(currency, targetCurrency, date));
      } catch {
        hadError = true;
        rates.set(rateKey(currency, date), 1);
      }
    })
  );

  return { rates, hadError };
}

export function useExchangeRates(
  expenses: Expense[],
  targetCurrency: CurrencyCode,
  provider?: ExchangeRateProvider
): UseExchangeRatesResult {
  const t = useTranslations("common");
  const rateProvider = useMemo(
    () => provider ?? new CachedExchangeRateProvider(new FrankfurterExchangeRateProvider()),
    [provider]
  );

  const [resolvedRates, setResolvedRates] = useState<Map<string, number>>(new Map());
  const [isConverting, setIsConverting] = useState(false);

  const missingPairs = useMemo(
    () => uniquePairsNeeding(expenses, targetCurrency, resolvedRates),
    [expenses, targetCurrency, resolvedRates]
  );

  useEffect(() => {
    if (missingPairs.length === 0) return;

    let cancelled = false;

    async function convert() {
      setIsConverting(true);
      const { rates, hadError } = await resolveRates(rateProvider, missingPairs, targetCurrency);
      if (cancelled) return;

      setResolvedRates((prev) => {
        const next = new Map(prev);
        for (const [key, rate] of rates) next.set(key, rate);
        return next;
      });
      setIsConverting(false);
      if (hadError) toast.error(t("exchangeRateError"));
    }

    convert();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missingPairs, targetCurrency, rateProvider]);

  const convertedAmounts = useMemo(() => {
    const amounts: Record<string, number> = {};
    for (const expense of expenses) {
      if (expense.currency === targetCurrency) {
        amounts[expense.id] = expense.amount;
        continue;
      }
      const rate = resolvedRates.get(rateKey(expense.currency, expense.date));
      if (rate !== undefined) amounts[expense.id] = expense.amount * rate;
    }
    return amounts;
  }, [expenses, targetCurrency, resolvedRates]);

  return { convertedAmounts, isConverting };
}
