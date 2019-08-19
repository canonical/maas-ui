import { shallow } from "enzyme";
import React from "react";
import Dhcp from "./Dhcp";

it("works with enzyme", () => {
  const wrapper = shallow(<Dhcp />);
  expect(wrapper).toMatchSnapshot();
});
