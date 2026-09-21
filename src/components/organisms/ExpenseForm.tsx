"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, resolveDateFnsLocale, toIsoDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { EXPENSE_CATEGORIES } from "@/features/expenses/model/constants";
import {
  expenseFormSchema,
  type ExpenseFormInput,
  type ExpenseFormValues,
} from "@/features/expenses/model/schema";
import { useCurrentCurrency } from "@/features/settings/controller/SettingsContext";
import { SUPPORTED_CURRENCIES } from "@/features/settings/model/constants";

interface ExpenseFormProps {
  defaultValues?: Partial<ExpenseFormInput>;
  onSubmit: (values: ExpenseFormValues) => Promise<boolean>;
  onCancel: () => void;
}

function DateField({
  value,
  onChange,
  locale,
}: {
  value: string;
  onChange: (isoDate: string) => void;
  locale: string;
}) {
  const selected = value ? new Date(`${value}T00:00:00`) : undefined;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn("justify-start gap-2 font-normal", !value && "text-muted-foreground")}
          />
        }
      >
        <CalendarIcon className="size-4" />
        {value ? formatDate(value, locale) : null}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => date && onChange(toIsoDate(date))}
          locale={resolveDateFnsLocale(locale)}
        />
      </PopoverContent>
    </Popover>
  );
}

export function ExpenseForm({ defaultValues, onSubmit, onCancel }: ExpenseFormProps) {
  const t = useTranslations();
  const locale = useLocale();
  const baseCurrency = useCurrentCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormInput, unknown, ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      date: toIsoDate(new Date()),
      amount: 0,
      currency: baseCurrency,
      category: "Food",
      description: "",
      ...defaultValues,
    },
  });

  const submit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    const success = await onSubmit(values);
    setIsSubmitting(false);
    return success;
  });

  return (
    <form onSubmit={submit}>
      <FieldGroup>
        <Field data-invalid={Boolean(errors.date)}>
          <FieldLabel>{t("expenses.fields.date")}</FieldLabel>
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <DateField value={field.value} onChange={field.onChange} locale={locale} />
            )}
          />
          <FieldError errors={errors.date ? [{ message: t(errors.date.message as never) }] : []} />
        </Field>

        <Field data-invalid={Boolean(errors.amount || errors.currency)}>
          <FieldLabel>{t("expenses.fields.amount")}</FieldLabel>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder={t("expenses.placeholders.amount")}
              aria-invalid={Boolean(errors.amount)}
              className="flex-1"
              {...register("amount")}
            />
            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-24" aria-invalid={Boolean(errors.currency)}>
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
              )}
            />
          </div>
          <FieldError
            errors={
              [errors.amount, errors.currency]
                .filter((error) => error != null)
                .map((error) => ({ message: t(error.message as never) }))
            }
          />
        </Field>

        <Field data-invalid={Boolean(errors.category)}>
          <FieldLabel>{t("expenses.fields.category")}</FieldLabel>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full" aria-invalid={Boolean(errors.category)}>
                  <SelectValue placeholder={t("expenses.placeholders.selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {t(`categories.${category}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError
            errors={errors.category ? [{ message: t(errors.category.message as never) }] : []}
          />
        </Field>

        <Field data-invalid={Boolean(errors.description)}>
          <FieldLabel>{t("expenses.fields.description")}</FieldLabel>
          <Input
            placeholder={t("expenses.placeholders.description")}
            aria-invalid={Boolean(errors.description)}
            {...register("description")}
          />
          <FieldError
            errors={
              errors.description ? [{ message: t(errors.description.message as never) }] : []
            }
          />
        </Field>
      </FieldGroup>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {t("expenses.form.cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("expenses.form.saving") : t("expenses.form.save")}
        </Button>
      </div>
    </form>
  );
}
