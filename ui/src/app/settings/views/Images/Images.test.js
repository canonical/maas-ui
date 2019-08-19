import { shallow } from "enzyme";
import React from "react";
import Images from "./Images";

it("works with enzyme", () => {
  const wrapper = shallow(<Images />);
  expect(wrapper).toMatchSnapshot();
});
