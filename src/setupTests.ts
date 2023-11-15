import "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, beforeAll } from "vitest";
import createFetchMock from "vitest-fetch-mock";
const fetchMocker = createFetchMock(vi);

fetchMocker.enableMocks();

beforeAll(() => {
  // disable act warnings
  global.IS_VITE_ACT_ENVIRONMENT = false;
});
