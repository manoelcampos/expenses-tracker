import type { CurrencyCode, Locale } from "./types";

export const SUPPORTED_LOCALES: Locale[] = ["en-US", "pt-BR"];

export const SUPPORTED_CURRENCIES: CurrencyCode[] = [
  "USD",
  "BRL",
  "EUR",
  "CAD",
  "GBP",
];

export const LOCALE_DEFAULT_CURRENCY: Record<Locale, CurrencyCode> = {
  "en-US": "USD",
  "pt-BR": "BRL",
};

export const SETTINGS_STORAGE_KEY = "expenses-tracker:settings:v1";
