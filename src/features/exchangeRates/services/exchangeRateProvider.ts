import type { CurrencyCode } from "@/features/settings/model/types";

export interface ExchangeRateProvider {
  /** Units of `to` per 1 unit of `from`, as of `date` (yyyy-MM-dd). */
  getRate(from: CurrencyCode, to: CurrencyCode, date: string): Promise<number>;
}
