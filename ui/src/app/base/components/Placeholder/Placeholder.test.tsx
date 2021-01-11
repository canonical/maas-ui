import { shallow } from "enzyme";

import Placeholder from "./Placeholder";

describe("Placeholder", () => {
  beforeEach(() => {
    jest.spyOn(Math, "floor").mockReturnValue(0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders", () => {
    const wrapper = shallow(<Placeholder>Placeholder text</Placeholder>);
    expect(wrapper).toMatchSnapshot();
  });
});
