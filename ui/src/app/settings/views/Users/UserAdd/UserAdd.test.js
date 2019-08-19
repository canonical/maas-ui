import { shallow } from "enzyme";
import React from "react";
import { UserAdd } from "./UserAdd";

describe("UserAdd", () => {
  it("can render", () => {
    const wrapper = shallow(<UserAdd />);
    expect(wrapper).toMatchSnapshot();
  });
});
