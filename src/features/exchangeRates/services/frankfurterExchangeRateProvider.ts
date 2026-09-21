import type { CurrencyCode } from "@/features/settings/model/types";
import type { ExchangeRateProvider } from "./exchangeRateProvider";

const FRANKFURTER_BASE_URL = "https://api.frankfurter.dev/v1";

export class ExchangeRateError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "ExchangeRateError";
  }
}

interface FrankfurterResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export class FrankfurterExchangeRateProvider implements ExchangeRateProvider {
  async getRate(from: CurrencyCode, to: CurrencyCode, date: string): Promise<number> {
    if (from === to) return 1;

    let response: Response;
    try {
      response = await fetch(`${FRANKFURTER_BASE_URL}/${date}?from=${from}&to=${to}`);
    } catch (cause) {
      throw new ExchangeRateError(`Failed to reach the exchange rate service`, cause);
    }

    if (!response.ok) {
      throw new ExchangeRateError(
        `Exchange rate service returned ${response.status} for ${from}->${to} on ${date}`
      );
    }

    const data = (await response.json()) as FrankfurterResponse;
    const rate = data.rates[to];
    if (typeof rate !== "number") {
      throw new ExchangeRateError(`No rate returned for ${from}->${to} on ${date}`);
    }

    return rate;
  }
}
