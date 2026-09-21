import { describe, expect, it, vi } from "vitest";
import { StorageError, readJson, writeJson } from "./storage";

describe("readJson", () => {
  it("returns the fallback when nothing is stored", () => {
    expect(readJson("missing-key", { a: 1 })).toEqual({ a: 1 });
  });

  it("parses a previously stored value", () => {
    window.localStorage.setItem("key", JSON.stringify({ a: 2 }));
    expect(readJson("key", { a: 1 })).toEqual({ a: 2 });
  });

  it("throws a StorageError when the stored value is corrupt JSON", () => {
    window.localStorage.setItem("corrupt", "{not-json");
    expect(() => readJson("corrupt", {})).toThrow(StorageError);
  });
});

describe("writeJson", () => {
  it("serializes and stores the value", () => {
    writeJson("key", { a: 3 });
    expect(window.localStorage.getItem("key")).toBe(JSON.stringify({ a: 3 }));
  });

  it("throws a StorageError when localStorage.setItem throws (e.g. quota exceeded)", () => {
    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new DOMException("QuotaExceededError");
      });

    expect(() => writeJson("key", { a: 1 })).toThrow(StorageError);

    spy.mockRestore();
  });
});
