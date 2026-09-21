import { describe, expect, it, vi, afterEach } from "vitest";
import { ExchangeRateError, FrankfurterExchangeRateProvider } from "./frankfurterExchangeRateProvider";

describe("FrankfurterExchangeRateProvider", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns 1 without calling fetch when the currencies match", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const provider = new FrankfurterExchangeRateProvider();
    await expect(provider.getRate("USD", "USD", "2026-03-05")).resolves.toBe(1);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("fetches and returns the rate for the requested pair and date", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          amount: 1,
          base: "USD",
          date: "2026-03-05",
          rates: { BRL: 5.13 },
        }),
      })
    );

    const provider = new FrankfurterExchangeRateProvider();
    await expect(provider.getRate("USD", "BRL", "2026-03-05")).resolves.toBe(5.13);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.frankfurter.dev/v1/2026-03-05?from=USD&to=BRL"
    );
  });

  it("throws an ExchangeRateError when the response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    const provider = new FrankfurterExchangeRateProvider();
    await expect(provider.getRate("USD", "BRL", "2026-03-05")).rejects.toBeInstanceOf(
      ExchangeRateError
    );
  });

  it("throws an ExchangeRateError when the network request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down"))
    );

    const provider = new FrankfurterExchangeRateProvider();
    await expect(provider.getRate("USD", "BRL", "2026-03-05")).rejects.toBeInstanceOf(
      ExchangeRateError
    );
  });

  it("throws an ExchangeRateError when the target currency is missing from the response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ amount: 1, base: "USD", date: "2026-03-05", rates: {} }),
      })
    );

    const provider = new FrankfurterExchangeRateProvider();
    await expect(provider.getRate("USD", "BRL", "2026-03-05")).rejects.toBeInstanceOf(
      ExchangeRateError
    );
  });
});
