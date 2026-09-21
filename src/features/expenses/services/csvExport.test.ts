import { describe, expect, it, vi } from "vitest";
import type { Expense } from "../model/types";
import { expensesToCsv, triggerCsvDownload } from "./csvExport";

const expenses: Expense[] = [
  {
    id: "1",
    date: "2026-03-05",
    amount: 42.5,
    currency: "USD",
    category: "Food",
    description: "Groceries",
    createdAt: "2026-03-05T10:00:00.000Z",
    updatedAt: "2026-03-05T10:00:00.000Z",
  },
  {
    id: "2",
    date: "2026-03-06",
    amount: 10,
    currency: "EUR",
    category: "Other",
    description: 'Gift, "special"',
    createdAt: "2026-03-06T10:00:00.000Z",
    updatedAt: "2026-03-06T10:00:00.000Z",
  },
];

describe("expensesToCsv", () => {
  it("produces a header row and one row per expense, using each expense's own currency", () => {
    const csv = expensesToCsv(expenses);
    const lines = csv.split("\n");

    expect(lines[0]).toBe("date,amount,currency,category,description");
    expect(lines[1]).toBe("2026-03-05,42.5,USD,Food,Groceries");
    expect(lines[2]).toBe('2026-03-06,10,EUR,Other,"Gift, ""special"""');
  });

  it("produces only the header for an empty list", () => {
    expect(expensesToCsv([])).toBe("date,amount,currency,category,description");
  });
});

describe("triggerCsvDownload", () => {
  it("creates a temporary anchor and triggers a click to download the file", () => {
    const createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
    const revokeObjectURL = vi.fn();
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;

    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    triggerCsvDownload("expenses.csv", "date,amount\n2026-03-05,10");

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");

    clickSpy.mockRestore();
  });
});
