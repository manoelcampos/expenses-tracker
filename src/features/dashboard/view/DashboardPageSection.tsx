"use client";

import { useTranslations } from "next-intl";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { SummaryCards } from "@/components/organisms/SummaryCards";
import { SpendingByCategoryChart } from "@/components/organisms/SpendingByCategoryChart";
import { MonthlyTrendChart } from "@/components/organisms/MonthlyTrendChart";
import { ExpenseTable } from "@/components/organisms/ExpenseTable";
import { ExpenseCardList } from "@/components/organisms/ExpenseCardList";
import { useExpenses } from "@/features/expenses/controller/useExpenses";
import { useDashboardMetrics } from "../controller/useDashboardMetrics";

const RECENT_EXPENSES_LIMIT = 5;

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-24 w-full" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-72 w-full" />
    </div>
  );
}

export function DashboardPageSection() {
  const t = useTranslations("dashboard");
  const { expenses, isHydrated } = useExpenses();
  const metrics = useDashboardMetrics(expenses);

  const recentExpenses = [...expenses]
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
    .slice(0, RECENT_EXPENSES_LIMIT);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {!isHydrated ? (
        <DashboardSkeleton />
      ) : expenses.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">{t("noData")}</p>
      ) : (
        <>
          <SummaryCards metrics={metrics} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("categoryBreakdown")}</CardTitle>
              </CardHeader>
              <CardContent>
                <SpendingByCategoryChart data={metrics.categoryBreakdown} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("monthlyTrend")}</CardTitle>
              </CardHeader>
              <CardContent>
                <MonthlyTrendChart data={metrics.monthlyTrend} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("recentExpenses")}</CardTitle>
              <CardAction>
                <Button
                  variant="ghost"
                  size="sm"
                  render={<Link href="/expenses" />}
                  nativeButton={false}
                >
                  {t("viewAll")}
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <ExpenseTable expenses={recentExpenses} emptyMessage="" className="hidden md:block" />
              <ExpenseCardList expenses={recentExpenses} emptyMessage="" className="md:hidden" />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
