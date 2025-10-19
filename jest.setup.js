import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Polyfill TextEncoder/TextDecoder for libraries that expect them (e.g., react-router)
import { TextEncoder, TextDecoder } from 'util';
if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}
if (!global.TextDecoder) {
  // @ts-ignore
  global.TextDecoder = TextDecoder;
}

// antd requires matchMedia in jsdom
if (!window.matchMedia) {
  // @ts-ignore
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// antd may rely on ResizeObserver
if (!('ResizeObserver' in global)) {
  // @ts-ignore
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
