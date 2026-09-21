"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { StorageError } from "@/lib/storage";
import { LOCALE_DEFAULT_CURRENCY } from "../model/constants";
import type { AppSettings, CurrencyCode, Locale } from "../model/types";
import { LocalStorageSettingsRepository } from "../services/localStorageSettingsRepository";
import type { SettingsRepository } from "../services/settingsRepository";

export interface UseSettingsOptions {
  defaultLocale: Locale;
  repository?: SettingsRepository;
  initialSettings?: AppSettings;
}

export interface UseSettingsResult {
  settings: AppSettings;
  isHydrated: boolean;
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: CurrencyCode) => void;
}

function buildDefaultSettings(locale: Locale): AppSettings {
  return { locale, currency: LOCALE_DEFAULT_CURRENCY[locale] };
}

export function useSettings({
  defaultLocale,
  repository,
  initialSettings,
}: UseSettingsOptions): UseSettingsResult {
  const t = useTranslations("common");
  const repo = useMemo(
    () => repository ?? new LocalStorageSettingsRepository(),
    [repository]
  );

  const [settings, setSettings] = useState<AppSettings>(
    () => initialSettings ?? buildDefaultSettings(defaultLocale)
  );
  const [isHydrated, setIsHydrated] = useState(Boolean(initialSettings));

  useEffect(() => {
    if (initialSettings) return;

    let cancelled = false;

    async function hydrate() {
      try {
        const saved = await repo.get();
        if (cancelled) return;
        setSettings(saved ?? buildDefaultSettings(defaultLocale));
      } catch (error) {
        if (error instanceof StorageError) {
          toast.error(t("storageReadError"));
        }
        if (!cancelled) setSettings(buildDefaultSettings(defaultLocale));
      } finally {
        if (!cancelled) setIsHydrated(true);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback(
    async (next: AppSettings) => {
      setSettings(next);
      try {
        await repo.save(next);
      } catch {
        toast.error(t("storageError"));
      }
    },
    [repo, t]
  );

  const setLocale = useCallback(
    (locale: Locale) => {
      persist({ ...settings, locale });
    },
    [persist, settings]
  );

  const setCurrency = useCallback(
    (currency: CurrencyCode) => {
      persist({ ...settings, currency });
    },
    [persist, settings]
  );

  return { settings, isHydrated, setLocale, setCurrency };
}
