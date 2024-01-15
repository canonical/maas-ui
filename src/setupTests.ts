import "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, beforeAll } from "vitest";
import createFetchMock from "vitest-fetch-mock";
const fetchMocker = createFetchMock(vi);

fetchMocker.enableMocks();
const originalObserver = window.ResizeObserver;

beforeAll(() => {
  // disable act warnings
  global.IS_REACT_ACT_ENVIRONMENT = false;
});

// mock ResizeObserver for MainToolbar
beforeEach(() => {
  window.ResizeObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

afterEach(() => {
  window.ResizeObserver = originalObserver;
});
