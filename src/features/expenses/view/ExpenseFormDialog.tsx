"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExpenseForm } from "@/components/organisms/ExpenseForm";
import type { ExpenseFormInput, ExpenseFormValues } from "../model/schema";

interface ExpenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<ExpenseFormInput>;
  onSubmit: (values: ExpenseFormValues) => Promise<boolean>;
}

export function ExpenseFormDialog({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSubmit,
}: ExpenseFormDialogProps) {
  const t = useTranslations("expenses");

  const handleSubmit = async (values: ExpenseFormValues) => {
    const success = await onSubmit(values);
    if (success) onOpenChange(false);
    return success;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? t("addExpense") : t("editExpense")}</DialogTitle>
        </DialogHeader>
        <ExpenseForm
          key={defaultValues ? JSON.stringify(defaultValues) : "new"}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
