"use client";

import { useTranslations } from "next-intl";
import {
  Car,
  Clapperboard,
  MoreHorizontal,
  Receipt,
  ShoppingBag,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ExpenseCategory } from "@/features/expenses/model/types";

const CATEGORY_ICONS: Record<ExpenseCategory, LucideIcon> = {
  Food: Utensils,
  Transportation: Car,
  Entertainment: Clapperboard,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Other: MoreHorizontal,
};

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Transportation: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Entertainment:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Shopping: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  Bills: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

interface CategoryBadgeProps {
  category: ExpenseCategory;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const t = useTranslations("categories");
  const Icon = CATEGORY_ICONS[category];

  return (
    <Badge
      variant="secondary"
      className={cn("gap-1 border-transparent font-normal", CATEGORY_COLORS[category], className)}
    >
      <Icon className="size-3.5" />
      {t(category)}
    </Badge>
  );
}
