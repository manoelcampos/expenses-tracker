import { format, parseISO } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";

const DATE_FNS_LOCALES = {
  "en-US": enUS,
  "pt-BR": ptBR,
} as const;

export function resolveDateFnsLocale(locale: string) {
  return DATE_FNS_LOCALES[locale as keyof typeof DATE_FNS_LOCALES] ?? enUS;
}

export function formatDate(isoDate: string, locale: string): string {
  return format(parseISO(isoDate), "PP", {
    locale: resolveDateFnsLocale(locale),
  });
}

export function toIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function currentIsoMonth(date: Date = new Date()): string {
  return format(date, "yyyy-MM");
}
