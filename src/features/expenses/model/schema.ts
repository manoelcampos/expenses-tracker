import { z } from "zod";
import { EXPENSE_CATEGORIES } from "./constants";

export const expenseFormSchema = z.object({
  date: z
    .string()
    .min(1, "validation.dateRequired")
    .refine((value) => !Number.isNaN(Date.parse(value)), "validation.dateInvalid"),
  amount: z.coerce
    .number({ error: "validation.amountInvalid" })
    .positive("validation.amountPositive")
    .max(1_000_000_000, "validation.amountTooLarge"),
  category: z.enum(EXPENSE_CATEGORIES, {
    error: "validation.categoryRequired",
  }),
  description: z
    .string()
    .trim()
    .min(1, "validation.descriptionRequired")
    .max(200, "validation.descriptionTooLong"),
});

export type ExpenseFormInput = z.input<typeof expenseFormSchema>;
export type ExpenseFormValues = z.output<typeof expenseFormSchema>;

export const expenseSchema = expenseFormSchema.extend({
  id: z.uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
