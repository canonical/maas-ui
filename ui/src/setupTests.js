import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("uuid/v4", () =>
  jest.fn(() => "00000000-0000-0000-0000-000000000000")
);
