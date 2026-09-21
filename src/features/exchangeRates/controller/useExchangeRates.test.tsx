import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import messages from "@/messages/en-US.json";
import type { Expense } from "@/features/expenses/model/types";
import type { ExchangeRateProvider } from "../services/exchangeRateProvider";
import { useExchangeRates } from "./useExchangeRates";

function wrapper({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="en-US" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

function buildExpense(overrides: Partial<Expense>): Expense {
  return {
    id: "1",
    date: "2026-03-05",
    amount: 100,
    currency: "USD",
    category: "Food",
    description: "Groceries",
    createdAt: "x",
    updatedAt: "x",
    ...overrides,
  };
}

describe("useExchangeRates", () => {
  it("passes through amounts already in the target currency without calling the provider", async () => {
    const provider: ExchangeRateProvider = { getRate: vi.fn() };
    const expenses = [buildExpense({ id: "1", currency: "USD", amount: 100 })];

    const { result } = renderHook(() => useExchangeRates(expenses, "USD", provider), { wrapper });

    await waitFor(() => expect(result.current.isConverting).toBe(false));
    expect(result.current.convertedAmounts).toEqual({ "1": 100 });
    expect(provider.getRate).not.toHaveBeenCalled();
  });

  it("converts expenses in a different currency using the historical rate for their date", async () => {
    const provider: ExchangeRateProvider = {
      getRate: vi.fn().mockResolvedValue(5),
    };
    const expenses = [
      buildExpense({ id: "1", currency: "EUR", amount: 100, date: "2026-03-05" }),
      buildExpense({ id: "2", currency: "USD", amount: 50, date: "2026-03-05" }),
    ];

    const { result } = renderHook(() => useExchangeRates(expenses, "USD", provider), { wrapper });

    await waitFor(() => expect(result.current.isConverting).toBe(false));
    expect(result.current.convertedAmounts).toEqual({ "1": 500, "2": 50 });
    expect(provider.getRate).toHaveBeenCalledWith("EUR", "USD", "2026-03-05");
  });

  it("dedupes rate lookups for expenses sharing the same currency and date", async () => {
    const provider: ExchangeRateProvider = { getRate: vi.fn().mockResolvedValue(5) };
    const expenses = [
      buildExpense({ id: "1", currency: "EUR", amount: 10, date: "2026-03-05" }),
      buildExpense({ id: "2", currency: "EUR", amount: 20, date: "2026-03-05" }),
    ];

    const { result } = renderHook(() => useExchangeRates(expenses, "USD", provider), { wrapper });

    await waitFor(() => expect(result.current.isConverting).toBe(false));
    expect(provider.getRate).toHaveBeenCalledOnce();
    expect(result.current.convertedAmounts).toEqual({ "1": 50, "2": 100 });
  });

  it("falls back to an unconverted amount and warns when a rate lookup fails", async () => {
    const { toast } = await import("sonner");
    const errorSpy = vi.spyOn(toast, "error").mockImplementation(() => "");

    const provider: ExchangeRateProvider = {
      getRate: vi.fn().mockRejectedValue(new Error("boom")),
    };
    const expenses = [buildExpense({ id: "1", currency: "EUR", amount: 100 })];

    const { result } = renderHook(() => useExchangeRates(expenses, "USD", provider), { wrapper });

    await waitFor(() => expect(result.current.isConverting).toBe(false));
    expect(result.current.convertedAmounts).toEqual({ "1": 100 });
    expect(errorSpy).toHaveBeenCalledOnce();

    errorSpy.mockRestore();
  });
});
