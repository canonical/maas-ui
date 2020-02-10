import { shallow } from "enzyme";
import React from "react";

import AddChassis from "./AddChassis";

describe("AddChassis", () => {
  it("renders", () => {
    const wrapper = shallow(<AddChassis />);
    expect(wrapper).toMatchSnapshot();
  });
});
