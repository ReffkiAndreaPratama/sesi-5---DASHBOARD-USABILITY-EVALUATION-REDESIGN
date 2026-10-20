import '@testing-library/jest-dom'

// ─── Polyfills for jsdom ────────────────────────────────────────────────────
// Recharts dan beberapa komponen lain memerlukan API browser yang belum
// tersedia di jsdom. Berikut mock minimal yang cukup untuk pengujian.

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver

// matchMedia — dibutuhkan oleh beberapa komponen responsif
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// getBoundingClientRect — Recharts membaca dimensi SVG
if (typeof SVGElement !== 'undefined') {
  SVGElement.prototype.getBoundingClientRect = SVGElement.prototype.getBoundingClientRect || function () {
    return {
      width: 800,
      height: 600,
      top: 0,
      left: 0,
      right: 800,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }
  }
}
