import "@testing-library/react";
import "@testing-library/jest-dom";
import createFetchMock from "vitest-fetch-mock";

import { vi, beforeAll } from "vitest";
import "./testing/customMatchers";

const fetchMocker = createFetchMock(vi);

fetchMocker.enableMocks();
const originalObserver = window.ResizeObserver;
const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;

beforeAll(() => {
  // disable act warnings
  global.IS_REACT_ACT_ENVIRONMENT = false;
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
