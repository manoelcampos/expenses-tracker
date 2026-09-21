import { describe, expect, it } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import { CurrencyAmount } from "./CurrencyAmount";

describe("CurrencyAmount", () => {
  it("formats the amount using the active currency setting", () => {
    renderWithProviders(<CurrencyAmount amount={1234.5} />, {
      initialSettings: { locale: "en-US", currency: "USD" },
    });

    expect(screen.getByText("$1,234.50")).toBeInTheDocument();
  });

  it("reformats when a different currency is active", () => {
    renderWithProviders(<CurrencyAmount amount={10} />, {
      initialSettings: { locale: "en-US", currency: "GBP" },
    });

    expect(screen.getByText("£10.00")).toBeInTheDocument();
  });
});
