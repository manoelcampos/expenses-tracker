import { describe, expect, it, vi } from "vitest";
import { StorageError } from "@/lib/storage";
import type { NewExpense } from "../model/types";
import {
  ExpenseNotFoundError,
  LocalStorageExpenseRepository,
} from "./localStorageExpenseRepository";

const sample: NewExpense = {
  date: "2026-03-05",
  amount: 42.5,
  currency: "USD",
  category: "Food",
  description: "Groceries",
};

describe("LocalStorageExpenseRepository", () => {
  it("starts empty", async () => {
    const repository = new LocalStorageExpenseRepository();
    await expect(repository.getAll()).resolves.toEqual([]);
  });

  it("creates an expense with generated id and timestamps", async () => {
    const repository = new LocalStorageExpenseRepository();
    const created = await repository.create(sample);

    expect(created.id).toBeTruthy();
    expect(created.createdAt).toBeTruthy();
    expect(created.updatedAt).toBe(created.createdAt);
    expect(created.amount).toBe(42.5);

    await expect(repository.getAll()).resolves.toEqual([created]);
  });

  it("updates an existing expense and bumps updatedAt", async () => {
    const repository = new LocalStorageExpenseRepository();
    const created = await repository.create(sample);

    const updated = await repository.update(created.id, { amount: 99 });

    expect(updated.amount).toBe(99);
    expect(updated.id).toBe(created.id);
    expect(updated.createdAt).toBe(created.createdAt);
  });

  it("throws ExpenseNotFoundError when updating a missing expense", async () => {
    const repository = new LocalStorageExpenseRepository();
    await expect(repository.update("missing", { amount: 1 })).rejects.toBeInstanceOf(
      ExpenseNotFoundError
    );
  });

  it("removes an expense", async () => {
    const repository = new LocalStorageExpenseRepository();
    const created = await repository.create(sample);

    await repository.remove(created.id);

    await expect(repository.getAll()).resolves.toEqual([]);
  });

  it("removing a missing expense is a no-op", async () => {
    const repository = new LocalStorageExpenseRepository();
    await expect(repository.remove("missing")).resolves.toBeUndefined();
  });

  it("defaults missing currency to USD for records saved before multi-currency support", async () => {
    window.localStorage.setItem(
      "expenses-tracker:expenses:v1",
      JSON.stringify([
        {
          id: "legacy-1",
          date: "2026-01-01",
          amount: 10,
          category: "Food",
          description: "Old record",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ])
    );

    const repository = new LocalStorageExpenseRepository();
    const [expense] = await repository.getAll();

    expect(expense.currency).toBe("USD");
  });

  it("propagates a StorageError when the corrupt data is read", async () => {
    window.localStorage.setItem("expenses-tracker:expenses:v1", "{not-json");
    const repository = new LocalStorageExpenseRepository();
    await expect(repository.getAll()).rejects.toBeInstanceOf(StorageError);
  });

  it("propagates a StorageError when the browser storage write fails", async () => {
    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new DOMException("QuotaExceededError");
      });

    const repository = new LocalStorageExpenseRepository();
    await expect(repository.create(sample)).rejects.toBeInstanceOf(StorageError);

    spy.mockRestore();
  });
});
