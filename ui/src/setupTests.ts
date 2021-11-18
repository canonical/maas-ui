import { configure } from "@testing-library/react";
import "@testing-library/jest-dom";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import Enzyme from "enzyme";
import { enableFetchMocks } from "jest-fetch-mock";

Enzyme.configure({ adapter: new Adapter() });

configure({ testIdAttribute: "data-test" });

jest.mock("@reduxjs/toolkit", () => {
  const toolkit = jest.requireActual("@reduxjs/toolkit");
  return {
    ...toolkit,
    nanoid: jest.fn(() => "Uakgb_J5m9g-0JDMbcJqLJ"),
  };
});

enableFetchMocks();
