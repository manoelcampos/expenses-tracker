export type Locale = "en-US" | "pt-BR";

export type CurrencyCode = "USD" | "BRL" | "EUR" | "CAD" | "GBP";

export interface AppSettings {
  locale: Locale;
  currency: CurrencyCode;
}
