import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("@reduxjs/toolkit", () => {
  const toolkit = require.requireActual("@reduxjs/toolkit");
  return {
    ...toolkit,
    nanoid: jest.fn(() => "Uakgb_J5m9g-0JDMbcJqLJ"),
  };
});

jest.mock("uuid/v4", () => {
  return jest.fn(() => "Uakgb_J5m9g-0JDMbcJqLJ");
});
