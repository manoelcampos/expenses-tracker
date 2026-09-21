"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, Wallet } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/molecules/LanguageSwitcher";
import { CurrencySelector } from "@/components/molecules/CurrencySelector";
import { cn } from "@/lib/utils";

function useNavItems() {
  const t = useTranslations("nav");
  return [
    { href: "/", label: t("dashboard") },
    { href: "/expenses", label: t("expenses") },
  ] as const;
}

function NavLinks({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  const pathname = usePathname();
  const items = useNavItems();

  return (
    <nav className={cn("flex gap-1", className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
            pathname === item.href && "bg-accent text-accent-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function AppHeader() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Wallet className="size-5" />
          {t("appName")}
        </Link>

        <NavLinks className="hidden md:flex" />

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <CurrencySelector />
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" aria-label={t("menu")} className="md:hidden" />}
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>{t("appName")}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 px-4">
              <NavLinks onNavigate={() => setMobileOpen(false)} className="flex-col" />
              <div className="flex flex-col gap-2">
                <LanguageSwitcher />
                <CurrencySelector />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
