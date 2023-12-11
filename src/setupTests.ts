import "@testing-library/react";
import "@testing-library/jest-dom";
import { enableFetchMocks } from "jest-fetch-mock";

enableFetchMocks();
const originalObserver = window.ResizeObserver;

beforeAll(() => {
  // disable act warnings
  global.IS_REACT_ACT_ENVIRONMENT = false;
});

beforeEach(() => {
  window.ResizeObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

afterEach(() => {
  window.ResizeObserver = originalObserver;
});
