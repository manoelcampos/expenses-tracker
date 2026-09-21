"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettingsContext } from "@/features/settings/controller/SettingsContext";
import { SUPPORTED_LOCALES } from "@/features/settings/model/constants";
import type { Locale } from "@/features/settings/model/types";

const LOCALE_LABELS: Record<Locale, string> = {
  "en-US": "English (US)",
  "pt-BR": "Português (BR)",
};

export function LanguageSwitcher() {
  const t = useTranslations("settings");
  const { settings, setLocale } = useSettingsContext();

  return (
    <Select
      value={settings.locale}
      onValueChange={(value) => setLocale(value as Locale)}
    >
      <SelectTrigger size="sm" aria-label={t("language")}>
        <SelectValue>
          {(value: Locale) => LOCALE_LABELS[value]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LOCALES.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {LOCALE_LABELS[locale]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
