import { shallow } from "enzyme";

import Switch from "./Switch";

describe("Switch", () => {
  it("renders", () => {
    const wrapper = shallow(<Switch />);

    expect(wrapper).toMatchSnapshot();
  });
});
