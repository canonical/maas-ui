import { shallow } from "enzyme";
import React from "react";
import Configuration from "./Configuration";

it("works with enzyme", () => {
  const wrapper = shallow(<Configuration />);
  expect(wrapper).toMatchSnapshot();
});
