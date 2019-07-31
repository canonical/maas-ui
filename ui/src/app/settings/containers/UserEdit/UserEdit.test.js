import { shallow } from "enzyme";
import React from "react";
import { UserEdit } from "./UserEdit";

describe("UserEdit", () => {
  it("can render", () => {
    const wrapper = shallow(<UserEdit />);
    expect(wrapper).toMatchSnapshot();
  });
});
