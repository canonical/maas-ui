import { shallow } from "enzyme";
import React from "react";

import MachineList from "./MachineList";

describe("MachineList", () => {
  it("renders", () => {
    const wrapper = shallow(<MachineList />);
    expect(wrapper).toMatchSnapshot();
  });
});
