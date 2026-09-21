import { describe, expect, it } from "vitest";
import { currentIsoMonth, formatDate, toIsoDate } from "./date";

describe("formatDate", () => {
  it("formats an ISO date using US conventions", () => {
    expect(formatDate("2026-03-05", "en-US")).toBe("Mar 5, 2026");
  });

  it("formats an ISO date using Brazilian conventions", () => {
    expect(formatDate("2026-03-05", "pt-BR")).toBe("5 mar 2026");
  });

  it("falls back to en-US formatting for an unsupported locale", () => {
    expect(formatDate("2026-03-05", "fr-FR")).toBe("Mar 5, 2026");
  });
});

describe("toIsoDate", () => {
  it("formats a Date as yyyy-MM-dd", () => {
    expect(toIsoDate(new Date(2026, 2, 5))).toBe("2026-03-05");
  });
});

describe("currentIsoMonth", () => {
  it("formats a Date as yyyy-MM", () => {
    expect(currentIsoMonth(new Date(2026, 8, 21))).toBe("2026-09");
  });
});
