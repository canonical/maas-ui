import { shallow } from "enzyme";
import React from "react";

import { APIKeyAdd } from "./APIKeyAdd";

describe("APIKeyAdd", () => {
  it("can render", () => {
    const wrapper = shallow(<APIKeyAdd />);
    expect(wrapper.find("APIKeyForm").exists()).toBe(true);
  });
});
