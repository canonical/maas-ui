import { shallow } from "enzyme";
import React from "react";

import { DhcpAdd } from "./DhcpAdd";

describe("DhcpAdd", () => {
  it("can render", () => {
    const wrapper = shallow(<DhcpAdd />);
    expect(wrapper).toMatchSnapshot();
  });
});
