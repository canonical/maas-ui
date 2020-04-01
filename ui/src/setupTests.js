import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("nanoid", () => ({
  nanoid: jest.fn(() => "Uakgb_J5m9g-0JDMbcJqLJ"),
}));
