import { shallow } from "enzyme";
import React from "react";
import Storage from "./Storage";

it("works with enzyme", () => {
  const wrapper = shallow(<Storage />);
  expect(wrapper).toMatchSnapshot();
});
