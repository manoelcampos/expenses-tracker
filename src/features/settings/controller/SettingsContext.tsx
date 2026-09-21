"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppSettings, CurrencyCode, Locale } from "../model/types";
import type { SettingsRepository } from "../services/settingsRepository";
import { useSettings, type UseSettingsResult } from "./useSettings";

const SettingsContext = createContext<UseSettingsResult | null>(null);

export interface SettingsProviderProps {
  children: ReactNode;
  defaultLocale: Locale;
  repository?: SettingsRepository;
  initialSettings?: AppSettings;
}

export function SettingsProvider({
  children,
  defaultLocale,
  repository,
  initialSettings,
}: SettingsProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { settings, isHydrated, setLocale, setCurrency } = useSettings({
    defaultLocale,
    repository,
    initialSettings,
  });

  const changeLocale = useCallback(
    (locale: Locale) => {
      setLocale(locale);
      router.replace(pathname, { locale });
    },
    [setLocale, router, pathname]
  );

  return (
    <SettingsContext.Provider
      value={{ settings, isHydrated, setLocale: changeLocale, setCurrency }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext(): UseSettingsResult {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettingsContext must be used within a SettingsProvider");
  }
  return context;
}

export function useCurrentCurrency(): CurrencyCode {
  return useSettingsContext().settings.currency;
}
