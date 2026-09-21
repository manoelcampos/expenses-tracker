import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import messages from "@/messages/en-US.json";
import { StorageError } from "@/lib/storage";
import type { AppSettings } from "../model/types";
import type { SettingsRepository } from "../services/settingsRepository";
import { useSettings } from "./useSettings";

class FakeSettingsRepository implements SettingsRepository {
  constructor(private stored: AppSettings | null = null) {}

  async get() {
    return this.stored;
  }

  async save(settings: AppSettings) {
    this.stored = settings;
  }
}

function wrapper({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="en-US" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

describe("useSettings", () => {
  it("hydrates with the locale-derived default currency when nothing is saved", async () => {
    const { result } = renderHook(
      () =>
        useSettings({
          defaultLocale: "pt-BR",
          repository: new FakeSettingsRepository(),
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.settings).toEqual({ locale: "pt-BR", currency: "BRL" });
  });

  it("hydrates from previously saved settings", async () => {
    const repository = new FakeSettingsRepository({
      locale: "en-US",
      currency: "EUR",
    });

    const { result } = renderHook(
      () => useSettings({ defaultLocale: "en-US", repository }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.settings.currency).toBe("EUR");
  });

  it("updating the currency persists it without changing the locale", async () => {
    const repository = new FakeSettingsRepository();
    const { result } = renderHook(
      () => useSettings({ defaultLocale: "en-US", repository }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    result.current.setCurrency("GBP");

    await waitFor(() => expect(result.current.settings.currency).toBe("GBP"));
    expect(result.current.settings.locale).toBe("en-US");
    await expect(repository.get()).resolves.toEqual({
      locale: "en-US",
      currency: "GBP",
    });
  });

  it("surfaces a toast and still hydrates when reading storage fails", async () => {
    const { toast } = await import("sonner");
    const errorSpy = vi.spyOn(toast, "error").mockImplementation(() => "");

    const failingRepository: SettingsRepository = {
      get: () => Promise.reject(new StorageError("boom")),
      save: () => Promise.resolve(),
    };

    const { result } = renderHook(
      () => useSettings({ defaultLocale: "en-US", repository: failingRepository }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.settings).toEqual({ locale: "en-US", currency: "USD" });
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
