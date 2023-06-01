import "@testing-library/react";
import "@testing-library/jest-dom";
import { enableFetchMocks } from "jest-fetch-mock";

enableFetchMocks();

beforeAll(() => {
  // @ts-ignore next-line
  global.IS_REACT_ACT_ENVIRONMENT = false;
});
