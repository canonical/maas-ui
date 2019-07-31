import { shallow } from "enzyme";
import React from "react";
import { UserForm } from "./UserForm";

describe("UserForm", () => {
  it("can render", () => {
    const wrapper = shallow(<UserForm title="Add user" />);
    expect(wrapper).toMatchSnapshot();
  });
});
