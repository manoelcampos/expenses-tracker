import { describe, expect, it } from "vitest";
import { formatCurrency } from "./currency";

function normalizeSpaces(value: string): string {
  return value.replace(/ /g, " ");
}

describe("formatCurrency", () => {
  it("formats USD amounts using US conventions", () => {
    expect(formatCurrency(1234.5, "USD", "en-US")).toBe("$1,234.50");
  });

  it("formats BRL amounts using Brazilian conventions", () => {
    expect(normalizeSpaces(formatCurrency(1234.5, "BRL", "pt-BR"))).toBe(
      "R$ 1.234,50"
    );
  });

  it("formats zero correctly", () => {
    expect(formatCurrency(0, "USD", "en-US")).toBe("$0.00");
  });
});
