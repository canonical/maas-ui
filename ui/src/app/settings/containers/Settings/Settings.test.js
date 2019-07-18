import { shallow } from "enzyme";
import React from "react";

import Settings from "./Settings";

describe("Settings", () => {
  it("renders", () => {
    const wrapper = shallow(<Settings />);
    expect(wrapper).toMatchSnapshot();
  });
});
