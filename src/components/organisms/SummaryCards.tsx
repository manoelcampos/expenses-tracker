"use client";

import { useTranslations } from "next-intl";
import { CalendarDays, Hash, Trophy, Wallet } from "lucide-react";
import { StatCard } from "@/components/molecules/StatCard";
import { CurrencyAmount } from "@/components/atoms/CurrencyAmount";
import type { DashboardMetrics } from "@/features/dashboard/model/types";

interface SummaryCardsProps {
  metrics: DashboardMetrics;
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  const t = useTranslations("dashboard");
  const tCategories = useTranslations("categories");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard>
        <StatCard.Text>
          <StatCard.Label>{t("totalSpending")}</StatCard.Label>
          <StatCard.Value>
            <CurrencyAmount amount={metrics.totalSpending} />
          </StatCard.Value>
        </StatCard.Text>
        <StatCard.Icon>
          <Wallet />
        </StatCard.Icon>
      </StatCard>

      <StatCard>
        <StatCard.Text>
          <StatCard.Label>{t("currentMonthSpending")}</StatCard.Label>
          <StatCard.Value>
            <CurrencyAmount amount={metrics.currentMonthSpending} />
          </StatCard.Value>
        </StatCard.Text>
        <StatCard.Icon>
          <CalendarDays />
        </StatCard.Icon>
      </StatCard>

      <StatCard>
        <StatCard.Text>
          <StatCard.Label>{t("topCategory")}</StatCard.Label>
          <StatCard.Value className="text-xl">
            {metrics.topCategory ? tCategories(metrics.topCategory) : t("none")}
          </StatCard.Value>
        </StatCard.Text>
        <StatCard.Icon>
          <Trophy />
        </StatCard.Icon>
      </StatCard>

      <StatCard>
        <StatCard.Text>
          <StatCard.Label>{t("transactionCount")}</StatCard.Label>
          <StatCard.Value>{metrics.transactionCount}</StatCard.Value>
        </StatCard.Text>
        <StatCard.Icon>
          <Hash />
        </StatCard.Icon>
      </StatCard>
    </div>
  );
}
