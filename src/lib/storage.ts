export class StorageError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "StorageError";
  }
}

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (cause) {
    throw new StorageError(`Failed to read "${key}" from localStorage`, cause);
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (cause) {
    throw new StorageError(`Failed to write "${key}" to localStorage`, cause);
  }
}
