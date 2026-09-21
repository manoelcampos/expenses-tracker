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
import { SUPPORTED_CURRENCIES } from "@/features/settings/model/constants";
import type { CurrencyCode } from "@/features/settings/model/types";

export function CurrencySelector() {
  const t = useTranslations("settings");
  const { settings, setCurrency } = useSettingsContext();

  return (
    <Select
      value={settings.currency}
      onValueChange={(value) => setCurrency(value as CurrencyCode)}
    >
      <SelectTrigger size="sm" aria-label={t("currency")}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_CURRENCIES.map((currency) => (
          <SelectItem key={currency} value={currency}>
            {currency}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
