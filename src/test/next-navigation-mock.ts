import { vi } from "vitest";

export function useRouter() {
  return {
    replace: vi.fn(),
    push: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  };
}

export function usePathname() {
  return "/";
}

export function useParams() {
  return { locale: "en-US" };
}

export function useSearchParams() {
  return new URLSearchParams();
}
