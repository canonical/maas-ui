import { shallow } from "enzyme";
import React from "react";

import AddHardwareMenu from "./AddHardwareMenu";

describe("AddHardwareMenu", () => {
  it("can render", () => {
    const wrapper = shallow(<AddHardwareMenu />);
    expect(wrapper.find("AddHardwareMenu")).toMatchSnapshot();
  });

  it("can be disabled", () => {
    const wrapper = shallow(<AddHardwareMenu disabled />);
    expect(wrapper.find("ContextualMenu").props().toggleDisabled).toBe(true);
  });
});
