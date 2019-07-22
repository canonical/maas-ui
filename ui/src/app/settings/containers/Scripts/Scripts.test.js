import { shallow } from "enzyme";
import React from "react";
import Scripts from "./Scripts";

it("works with enzyme", () => {
  const wrapper = shallow(<Scripts />);
  expect(wrapper).toMatchSnapshot();
});
