import { readJson, writeJson } from "@/lib/storage";
import type { CurrencyCode } from "@/features/settings/model/types";
import type { ExchangeRateProvider } from "./exchangeRateProvider";

const CACHE_STORAGE_KEY = "expenses-tracker:exchange-rates:v1";

type RateCache = Record<string, number>;

function cacheKey(from: CurrencyCode, to: CurrencyCode, date: string): string {
  return `${from}:${to}:${date}`;
}

/**
 * Caches resolved rates in localStorage. Safe to cache indefinitely: a
 * historical day's rate never changes once published.
 */
export class CachedExchangeRateProvider implements ExchangeRateProvider {
  constructor(private readonly inner: ExchangeRateProvider) {}

  async getRate(from: CurrencyCode, to: CurrencyCode, date: string): Promise<number> {
    const key = cacheKey(from, to, date);
    const cache = readJson<RateCache>(CACHE_STORAGE_KEY, {});

    if (key in cache) return cache[key];

    const rate = await this.inner.getRate(from, to, date);
    writeJson(CACHE_STORAGE_KEY, { ...cache, [key]: rate });
    return rate;
  }
}
