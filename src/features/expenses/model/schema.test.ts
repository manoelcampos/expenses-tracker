import { describe, expect, it } from "vitest";
import { expenseFormSchema } from "./schema";

const validInput = {
  date: "2026-03-05",
  amount: 42.5,
  category: "Food" as const,
  description: "Groceries",
};

describe("expenseFormSchema", () => {
  it("accepts a valid expense", () => {
    const result = expenseFormSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects a missing date", () => {
    const result = expenseFormSchema.safeParse({ ...validInput, date: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("validation.dateRequired");
  });

  it("rejects an invalid date string", () => {
    const result = expenseFormSchema.safeParse({ ...validInput, date: "not-a-date" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("validation.dateInvalid");
  });

  it("rejects a zero or negative amount", () => {
    const result = expenseFormSchema.safeParse({ ...validInput, amount: 0 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("validation.amountPositive");
  });

  it("rejects a non-numeric amount", () => {
    const result = expenseFormSchema.safeParse({ ...validInput, amount: "abc" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("validation.amountInvalid");
  });

  it("rejects an amount that is too large", () => {
    const result = expenseFormSchema.safeParse({
      ...validInput,
      amount: 2_000_000_000,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("validation.amountTooLarge");
  });

  it("rejects an unsupported category", () => {
    const result = expenseFormSchema.safeParse({ ...validInput, category: "Rent" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("validation.categoryRequired");
  });

  it("rejects an empty description", () => {
    const result = expenseFormSchema.safeParse({ ...validInput, description: "   " });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("validation.descriptionRequired");
  });

  it("rejects a description over 200 characters", () => {
    const result = expenseFormSchema.safeParse({
      ...validInput,
      description: "a".repeat(201),
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("validation.descriptionTooLong");
  });

  it("trims the description", () => {
    const result = expenseFormSchema.safeParse({
      ...validInput,
      description: "  Groceries  ",
    });
    expect(result.success).toBe(true);
    expect(result.data?.description).toBe("Groceries");
  });
});
