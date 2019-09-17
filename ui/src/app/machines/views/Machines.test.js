import { shallow } from "enzyme";
import React from "react";

import Machines from "./Machines";

describe("Machines", () => {
  it("renders", () => {
    const wrapper = shallow(<Machines />);
    expect(wrapper.find("Section").exists());
    expect(wrapper.find("Section").prop("title")).toEqual("Machines");
  });
});
