import { enableFetchMocks } from "jest-fetch-mock";
import Enzyme from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("@reduxjs/toolkit", () => {
  const toolkit = jest.requireActual("@reduxjs/toolkit");
  return {
    ...toolkit,
    nanoid: jest.fn(() => "Uakgb_J5m9g-0JDMbcJqLJ"),
  };
});

jest.mock("nanoid", () => ({
  nanoid: jest.fn(() => "Uakgb_J5m9g-0JDMbcJqLJ"),
}));

enableFetchMocks();
