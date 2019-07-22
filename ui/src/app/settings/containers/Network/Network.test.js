import { shallow } from "enzyme";
import React from "react";
import Network from "./Network";

it("works with enzyme", () => {
  const wrapper = shallow(<Network />);
  expect(wrapper).toMatchSnapshot();
});
