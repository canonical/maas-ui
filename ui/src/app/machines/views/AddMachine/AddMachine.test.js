import { shallow } from "enzyme";
import React from "react";

import AddMachine from "./AddMachine";

describe("AddMachine", () => {
  it("renders", () => {
    const wrapper = shallow(<AddMachine />);
    expect(wrapper).toMatchSnapshot();
  });
});
