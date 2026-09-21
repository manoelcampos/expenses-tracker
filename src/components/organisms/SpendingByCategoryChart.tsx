"use client";

import { useLocale, useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/currency";
import { useCurrentCurrency } from "@/features/settings/controller/SettingsContext";
import type { CategoryBreakdown } from "@/features/dashboard/model/types";
import type { ExpenseCategory } from "@/features/expenses/model/types";

const CATEGORY_COLORS: Record<ExpenseCategory, { light: string; dark: string }> = {
  Food: { light: "#2a78d6", dark: "#3987e5" },
  Transportation: { light: "#eb6834", dark: "#d95926" },
  Entertainment: { light: "#1baf7a", dark: "#199e70" },
  Shopping: { light: "#eda100", dark: "#c98500" },
  Bills: { light: "#e87ba4", dark: "#d55181" },
  Other: { light: "#008300", dark: "#008300" },
};

interface SpendingByCategoryChartProps {
  data: CategoryBreakdown[];
}

export function SpendingByCategoryChart({ data }: SpendingByCategoryChartProps) {
  const t = useTranslations("categories");
  const locale = useLocale();
  const currency = useCurrentCurrency();

  const chartConfig = data.reduce<ChartConfig>((config, item) => {
    config[item.category] = { label: t(item.category), theme: CATEGORY_COLORS[item.category] };
    return config;
  }, {});

  const chartData = data.map((item) => ({ ...item, label: t(item.category) }));

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
      <BarChart data={chartData} layout="vertical" margin={{ right: 48 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          tickLine={false}
          axisLine={false}
          width={110}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, name) => (
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span
                      className="size-2.5 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: `var(--color-${name})` }}
                    />
                    {chartConfig[name as string]?.label ?? name}
                  </span>
                  <span className="font-mono font-medium text-foreground tabular-nums">
                    {formatCurrency(Number(value), currency, locale)}
                  </span>
                </div>
              )}
            />
          }
        />
        <Bar dataKey="total" radius={4} isAnimationActive={false}>
          {chartData.map((item) => (
            <Cell key={item.category} fill={`var(--color-${item.category})`} />
          ))}
          <LabelList
            dataKey="total"
            position="right"
            className="fill-foreground text-xs"
            formatter={(value) => formatCurrency(Number(value), currency, locale)}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
