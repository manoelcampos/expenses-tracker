import { describe, expect, it, vi } from "vitest";
import { StorageError } from "@/lib/storage";
import { SETTINGS_STORAGE_KEY } from "../model/constants";
import { LocalStorageSettingsRepository } from "./localStorageSettingsRepository";

describe("LocalStorageSettingsRepository", () => {
  it("returns null when no settings have been saved", async () => {
    const repository = new LocalStorageSettingsRepository();
    await expect(repository.get()).resolves.toBeNull();
  });

  it("persists and reloads settings", async () => {
    const repository = new LocalStorageSettingsRepository();
    await repository.save({ locale: "pt-BR", currency: "BRL" });

    await expect(repository.get()).resolves.toEqual({
      locale: "pt-BR",
      currency: "BRL",
    });
    expect(window.localStorage.getItem(SETTINGS_STORAGE_KEY)).not.toBeNull();
  });

  it("propagates a StorageError when the browser storage write fails", async () => {
    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new DOMException("QuotaExceededError");
      });

    const repository = new LocalStorageSettingsRepository();
    await expect(
      repository.save({ locale: "en-US", currency: "USD" })
    ).rejects.toBeInstanceOf(StorageError);

    spy.mockRestore();
  });
});
