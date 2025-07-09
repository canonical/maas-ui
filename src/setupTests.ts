import "@testing-library/react";
import "@testing-library/jest-dom";
import { URLSearchParams } from "node:url";

import { vi, beforeAll } from "vitest";
import createFetchMock from "vitest-fetch-mock";

import "./testing/customMatchers";

const fetchMocker = createFetchMock(vi);

fetchMocker.enableMocks();
const originalObserver = window.ResizeObserver;
const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;

beforeAll(() => {
  // disable act warnings
  global.IS_REACT_ACT_ENVIRONMENT = false;

  // Use URLSearchParams from node:url, since vitest uses Request and fetch from node while jsdom provides URLSearchParams https://github.com/vitest-dev/vitest/issues/7906
  Object.defineProperties(globalThis, {
    URLSearchParams: { value: URLSearchParams },
  });
});

beforeEach(() => {
  // mock ResizeObserver for MainToolbar
  window.ResizeObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // mock scrollIntoView for FormikFormContent
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  window.ResizeObserver = originalObserver;
  window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
});
