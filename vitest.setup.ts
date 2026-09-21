import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

const CHART_TEST_SIZE = { width: 500, height: 300 };

Element.prototype.getBoundingClientRect = () => ({
  ...CHART_TEST_SIZE,
  top: 0,
  left: 0,
  bottom: CHART_TEST_SIZE.height,
  right: CHART_TEST_SIZE.width,
  x: 0,
  y: 0,
  toJSON() {},
});

class ResizeObserverMock {
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback(
      [{ target, contentRect: Element.prototype.getBoundingClientRect.call(target) } as ResizeObserverEntry],
      this as unknown as ResizeObserver
    );
  }

  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

Element.prototype.scrollIntoView = Element.prototype.scrollIntoView ?? (() => {});
Element.prototype.hasPointerCapture =
  Element.prototype.hasPointerCapture ?? (() => false);
Element.prototype.setPointerCapture =
  Element.prototype.setPointerCapture ?? (() => {});
Element.prototype.releasePointerCapture =
  Element.prototype.releasePointerCapture ?? (() => {});
