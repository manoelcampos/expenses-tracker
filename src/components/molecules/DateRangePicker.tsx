"use client";

import { useLocale, useTranslations } from "next-intl";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate, resolveDateFnsLocale } from "@/lib/date";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
}

function formatRangeLabel(range: DateRange | undefined, locale: string): string | null {
  if (!range?.from) return null;
  const from = formatDate(range.from.toISOString().slice(0, 10), locale);
  if (!range.to) return from;
  const to = formatDate(range.to.toISOString().slice(0, 10), locale);
  return `${from} – ${to}`;
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const t = useTranslations("expenses.filters");
  const locale = useLocale();
  const label = formatRangeLabel(value, locale);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn("justify-start gap-2 font-normal", !label && "text-muted-foreground", className)}
          />
        }
      >
        <CalendarIcon className="size-4" />
        {label ?? t("pickDateRange")}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
          locale={resolveDateFnsLocale(locale)}
        />
      </PopoverContent>
    </Popover>
  );
}
