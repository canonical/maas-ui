import { shallow } from "enzyme";
import React from "react";
import Users from "./Users";

it("works with enzyme", () => {
  const wrapper = shallow(<Users />);
  expect(wrapper).toMatchSnapshot();
});
