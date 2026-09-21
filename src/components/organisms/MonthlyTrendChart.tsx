"use client";

import { useLocale, useTranslations } from "next-intl";
import { format, parse } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/currency";
import { resolveDateFnsLocale } from "@/lib/date";
import { useCurrentCurrency } from "@/features/settings/controller/SettingsContext";
import type { MonthlyTrendPoint } from "@/features/dashboard/model/types";

const SEQUENTIAL_BLUE = { light: "#2a78d6", dark: "#3987e5" };

interface MonthlyTrendChartProps {
  data: MonthlyTrendPoint[];
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const currency = useCurrentCurrency();
  const dateFnsLocale = resolveDateFnsLocale(locale);

  const chartConfig: ChartConfig = {
    total: { label: t("monthlyTrend"), theme: SEQUENTIAL_BLUE },
  };

  const chartData = data.map((point) => ({
    ...point,
    label: format(parse(point.month, "yyyy-MM", new Date()), "MMM", {
      locale: dateFnsLocale,
    }),
  }));

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
      <AreaChart data={chartData} margin={{ left: 0, right: 0 }}>
        <defs>
          <linearGradient id="monthly-trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel={false}
              formatter={(value) => (
                <span className="font-mono font-medium text-foreground tabular-nums">
                  {formatCurrency(Number(value), currency, locale)}
                </span>
              )}
            />
          }
        />
        <Area
          dataKey="total"
          type="monotone"
          stroke="var(--color-total)"
          strokeWidth={2}
          fill="url(#monthly-trend-fill)"
          dot={{ r: 3, fill: "var(--color-total)", strokeWidth: 0 }}
          activeDot={{ r: 4 }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
