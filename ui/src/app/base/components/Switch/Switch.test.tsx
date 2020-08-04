import { shallow } from "enzyme";
import React from "react";

import Switch from "./Switch";

describe("Switch", () => {
  it("renders", () => {
    const wrapper = shallow(<Switch />);

    expect(wrapper).toMatchSnapshot();
  });
});
