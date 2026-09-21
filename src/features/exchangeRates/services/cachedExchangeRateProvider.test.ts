import { describe, expect, it, vi } from "vitest";
import type { ExchangeRateProvider } from "./exchangeRateProvider";
import { CachedExchangeRateProvider } from "./cachedExchangeRateProvider";

describe("CachedExchangeRateProvider", () => {
  it("delegates to the inner provider on a cache miss", async () => {
    const inner: ExchangeRateProvider = { getRate: vi.fn().mockResolvedValue(5.13) };
    const cached = new CachedExchangeRateProvider(inner);

    await expect(cached.getRate("USD", "BRL", "2026-03-05")).resolves.toBe(5.13);
    expect(inner.getRate).toHaveBeenCalledOnce();
  });

  it("serves a repeated request from the cache without calling the inner provider again", async () => {
    const inner: ExchangeRateProvider = { getRate: vi.fn().mockResolvedValue(5.13) };
    const cached = new CachedExchangeRateProvider(inner);

    await cached.getRate("USD", "BRL", "2026-03-05");
    await cached.getRate("USD", "BRL", "2026-03-05");

    expect(inner.getRate).toHaveBeenCalledOnce();
  });

  it("caches distinct pairs and dates independently", async () => {
    const inner: ExchangeRateProvider = {
      getRate: vi.fn().mockResolvedValueOnce(5.13).mockResolvedValueOnce(0.92),
    };
    const cached = new CachedExchangeRateProvider(inner);

    await expect(cached.getRate("USD", "BRL", "2026-03-05")).resolves.toBe(5.13);
    await expect(cached.getRate("USD", "EUR", "2026-03-05")).resolves.toBe(0.92);
    expect(inner.getRate).toHaveBeenCalledTimes(2);
  });

  it("persists the cache in localStorage across instances", async () => {
    const inner: ExchangeRateProvider = { getRate: vi.fn().mockResolvedValue(5.13) };
    await new CachedExchangeRateProvider(inner).getRate("USD", "BRL", "2026-03-05");

    const freshInner: ExchangeRateProvider = { getRate: vi.fn() };
    const freshCached = new CachedExchangeRateProvider(freshInner);

    await expect(freshCached.getRate("USD", "BRL", "2026-03-05")).resolves.toBe(5.13);
    expect(freshInner.getRate).not.toHaveBeenCalled();
  });
});
