import type { CurrencyCode } from "@/features/settings/model/types";
import type { Expense } from "../model/types";

const CSV_COLUMNS = ["date", "amount", "currency", "category", "description"] as const;

function escapeCsvField(value: string): string {
  if (!/[",\n]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

function expenseToCsvRow(expense: Expense, currency: CurrencyCode): string {
  const fields = [
    expense.date,
    expense.amount.toString(),
    currency,
    expense.category,
    expense.description,
  ];
  return fields.map(escapeCsvField).join(",");
}

export function expensesToCsv(expenses: Expense[], currency: CurrencyCode): string {
  const header = CSV_COLUMNS.join(",");
  const rows = expenses.map((expense) => expenseToCsvRow(expense, currency));
  return [header, ...rows].join("\n");
}

export function triggerCsvDownload(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
