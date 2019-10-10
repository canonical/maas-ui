import { shallow } from "enzyme";
import React from "react";

import FormCard from "./FormCard";

describe("FormCard ", () => {
  it("renders", () => {
    const wrapper = shallow(<FormCard title="Add user" />);
    expect(wrapper).toMatchSnapshot();
  });

  it("can display the heading on a separate row", () => {
    const wrapper = shallow(<FormCard stacked title="Add user" />);
    expect(wrapper.find("Col").exists()).toBe(false);
  });
});
